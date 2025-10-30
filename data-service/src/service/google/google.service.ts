import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleAdsApi } from 'google-ads-api';
import { Manager } from '../../model/manager.model';
import { CUSTOMER_DETAILS_QUERY, IS_MANAGER_QUERY } from '../../util/queries';

@Injectable()
export class GoogleService {
  private client: GoogleAdsApi;

  constructor() {
    this.client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_APP_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
    });
  }

  private getCustomerInstance(customerId: string, refreshToken: string, loginCustomerId?: string) {
    return this.client.Customer({
      refresh_token: refreshToken,
      customer_id: customerId,
      login_customer_id: loginCustomerId,
    });
  }

  async executeQuery(
    customerId: string,
    refreshToken: string,
    query: string,
    loginCustomerId?: string
  ) {
    try {
      const customer = this.getCustomerInstance(customerId, refreshToken, loginCustomerId);
      const response = await customer.query(query);
      const rows = [...response];
      console.log(`Fetched ${rows.length} rows`);
      return rows;
    } catch (error: any) {
      let errorMessage = 'Failed to execute query on Google Ads account';

      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        errorMessage = error.errors[0].message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('Error executing query on Google Ads:', error);
      console.error('Google Ads error message:', errorMessage);

      throw new InternalServerErrorException(errorMessage);
    }
  }

  async getAccessibleAccounts(refreshToken: string): Promise<string[]> {
    try {
      const { resource_names } = await this.client.listAccessibleCustomers(refreshToken);
      return resource_names;
    } catch (error) {
      console.error('Error fetching accessible accounts:', error);
      throw new InternalServerErrorException('Failed to fetch accessible accounts');
    }
  }

  async isManager(
    customerId: string,
    refreshToken: string
  ): Promise<{ isManager: boolean; accountName: string }> {
    const cleanedId = customerId.replace('customers/', '');
    const query = IS_MANAGER_QUERY + cleanedId;

    try {
      const [result] = await this.executeQuery(customerId, refreshToken, query);
      const isManager = result?.customer?.manager ?? false;
      const accountName = result?.customer?.descriptive_name ?? '';
      return { isManager, accountName };
    } catch (error) {
      console.error('Error checking if account is a manager:', error);
      throw new InternalServerErrorException('Failed to check if account is a manager');
    }
  }

  async buildHierarchy(
    accountId: string,
    refreshToken: string,
    visited = new Set<string>(),
    loginCustomerId?: string
  ): Promise<Manager[]> {
    if (visited.has(accountId)) return [];
    visited.add(accountId);

    try {
      const rows = await this.executeQuery(
        accountId,
        refreshToken,
        CUSTOMER_DETAILS_QUERY,
        loginCustomerId
      );
      const manager: Manager = {
        managerId: accountId,
        name: '',
        clients: [],
      };

      const subManagerPromises: Promise<Manager[]>[] = [];

      for (const row of rows) {
        const client = row.customer_client;
        const clientId = client.client_customer.replace('customers/', '');
        const clientName = client.descriptive_name;

        if (client.manager) {
          // Recurse into child manager
          subManagerPromises.push(this.buildHierarchy(clientId, refreshToken, visited, accountId));
        } else {
          manager.clients.push({ customerId: clientId, name: clientName });
        }
      }

      const subManagers = await Promise.all(subManagerPromises);
      return subManagers.flat().concat(manager);
    } catch (error) {
      console.error('Error building hierarchy:', error);
      throw new InternalServerErrorException('Failed to build account hierarchy');
    }
  }
}
