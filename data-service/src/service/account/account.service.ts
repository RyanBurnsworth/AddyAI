import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import { Manager } from '../../model/manager.model';
import { Customer } from '../../model/customer.model';
import { AccountModel } from '../../model/account.model';
import { Account } from '../../entity/account.entity';
import { DataService } from '../data/data.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly googleService: GoogleService,
    private readonly dataService: DataService
  ) {}

  async fetchAccounts(userId: number, refreshToken: string): Promise<Account[]> {
    const accountModel = new AccountModel();
    accountModel.customerAccounts = [];
    accountModel.managerAccounts = [];

    // Step 1: Get accessible accounts
    let accessibleAccountsIds: string[];
    try {
      accessibleAccountsIds = (await this.googleService.getAccessibleAccounts(refreshToken)).map(
        customerId => customerId.replace('customers/', '')
      );
      console.log('Accessible customers: ', accessibleAccountsIds);
    } catch (error) {
      console.error('Error retrieving accessible accounts:', error);
      throw new NotFoundException('No accessible accounts found');
    }

    // Step 2: Batch process all accounts with limited concurrency
    const BATCH_SIZE = 10; // Limit concurrent API calls
    const accountPromises = [];

    for (let i = 0; i < accessibleAccountsIds.length; i += BATCH_SIZE) {
      const batch = accessibleAccountsIds.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(accountId => this.processAccount(accountId, refreshToken));
      accountPromises.push(Promise.allSettled(batchPromises));
    }

    const batchResults = await Promise.all(accountPromises);

    // Step 3: Collect all successful results
    const allResults = batchResults.flat().filter(result => result.status === 'fulfilled');

    for (const result of allResults) {
      const accountData = (result as PromiseFulfilledResult<any>).value;
      if (!accountData) continue;

      if (accountData.isManager) {
        accountModel.managerAccounts.push(...accountData.managers);
      } else {
        accountModel.customerAccounts.push(accountData.customer);
      }
    }

    console.log('Completed the collection of all results');
    return await this.storeAccountsBulk(userId, accountModel);
  }

  private async processAccount(accountId: string, refreshToken: string) {
    try {
      const { isManager, accountName } = await this.googleService.isManager(
        accountId,
        refreshToken
      );

      if (isManager) {
        const hierarchy = await this.googleService.buildHierarchy(accountId, refreshToken);
        if (!hierarchy) return null;

        const managers = hierarchy.map(managerAccount => {
          const manager = new Manager();
          manager.managerId = managerAccount.managerId;
          manager.name = accountName;
          manager.clients = (managerAccount.clients || []).map(client => {
            const customer = new Customer();
            customer.customerId = client.customerId;
            customer.name = client.name;
            return customer;
          });
          return manager;
        });

        return { isManager: true, managers };
      } else {
        const customer = new Customer();
        customer.name = accountName;
        customer.customerId = accountId;
        return { isManager: false, customer };
      }
    } catch (error) {
      console.error(`Error processing account ${accountId}:`, error);
      return null;
    }
  }

  async storeAccountsBulk(userId: number, accountModel: AccountModel): Promise<Account[]> {
    // Step 1: Collect all customer IDs that need to be checked
    const allCustomerIds = new Set<string>();

    // Add customer accounts
    accountModel.customerAccounts.forEach(customer => {
      allCustomerIds.add(customer.customerId);
    });

    // Add manager accounts and their clients
    accountModel.managerAccounts.forEach(manager => {
      allCustomerIds.add(manager.managerId);
      manager.clients.forEach(client => {
        allCustomerIds.add(client.customerId);
      });
    });

    // Step 2: Bulk check existing accounts (single query)
    const existingAccounts = await this.dataService.findAccountsByCustomerIds(
      Array.from(allCustomerIds)
    );
    const existingCustomerIds = new Set(existingAccounts.map(account => account.customerId));

    // Step 3: Prepare bulk insert data
    const accountsToInsert: Partial<Account>[] = [];
    const now = new Date();

    // Process customer accounts
    accountModel.customerAccounts.forEach(customer => {
      if (!existingCustomerIds.has(customer.customerId)) {
        accountsToInsert.push({
          customerId: customer.customerId,
          name: customer.name,
          isManager: false,
          userId,
          lastSynced: null,
          created_at: now,
        });
      }
    });

    // Process manager accounts
    accountModel.managerAccounts.forEach(manager => {
      // Add manager account
      if (!existingCustomerIds.has(manager.managerId)) {
        accountsToInsert.push({
          customerId: manager.managerId,
          name: manager.name,
          isManager: true,
          userId,
          lastSynced: null,
          created_at: now,
        });
      }

      // Add client accounts
      manager.clients.forEach(client => {
        if (!existingCustomerIds.has(client.customerId)) {
          accountsToInsert.push({
            customerId: client.customerId,
            name: client.name,
            isManager: false,
            managerId: manager.managerId,
            userId,
            lastSynced: null,
            created_at: now,
          });
        }
      });
    });

    // Step 4: Bulk insert new accounts
    if (accountsToInsert.length > 0) {
      try {
        await this.dataService.createAccountsBulk(accountsToInsert);
      } catch (error) {
        console.error('Error bulk inserting accounts:', error);
        throw new InternalServerErrorException('Error storing accounts');
      }
    }

    // Step 5: Return all user accounts
    return await this.dataService.findAccountsByUserId(userId);
  }

  async getLastSyncDate(customerId: string): Promise<string> {
    const account = await this.dataService.findAccountByCustomerId(customerId);
    if (!account || !account.lastSynced) return '';

    return account.lastSynced.toISOString();
  }
}
