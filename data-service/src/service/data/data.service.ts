import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { DataSource } from 'typeorm';
import { Usage } from '../../entity/usage.entity';
import { Account } from '../../entity/account.entity';
import { Conversation, Exchange } from '../../entity/conversation.entity';
import { Transaction } from '../../entity/transaction.entity';

@Injectable()
export class DataService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Execute a query on the Postgres database
   *
   * @param query the PSQL query to execute
   * @param parameters the parameters to pass to the Postgres db
   * @returns the results of the database query
   */
  async executeQuery<T = any>(query: string, parameters?: any[]): Promise<T[]> {
    try {
      return await this.dataSource.query(query, parameters);
    } catch (error) {
      console.log('Error executing PSQL query: ', error);
      throw new InternalServerErrorException('Error executing query');
    }
  }

  /**
   * Save records in the Postgres db one by one for detailed error tracking
   *
   * @param records the records to be stored
   * @param tableName the table name associated with the records
   */
  async genericSave(records: any[], tableName: string) {
    for (const [i, record] of records.entries()) {
      try {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(tableName)
          .values(record)
          .orIgnore()
          .execute();
      } catch (error) {
        console.error(`Error saving record #${i + 1} into ${tableName}:`);
        console.error(JSON.stringify(record, null, 2));
        console.error('Error:', error.message || error);
        throw new InternalServerErrorException(`Error saving record #${i + 1} into ${tableName}`);
      }
    }
  }

  /**
   * Find a user by their user id
   *
   * @param userId the id of the user
   * @returns the user object associated with the user
   */
  async findUserByUserId(userId: string): Promise<User | null> {
    try {
      const result = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId })
        .getOne();
      return result || null;
    } catch (error) {
      console.error('Error finding user by userId', error);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /**
   * Find a user by their email address
   *
   * @param email the email address of the user
   * @returns the user object associated with the user
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();
      return result || null;
    } catch (error) {
      console.error('Error finding user by email', error);
      throw new InternalServerErrorException('Error finding user');
    }
  }

  /**
   * Create a user and store their data in the Postgres User table
   *
   * @param user the user object to be created
   * @returns the created user object
   */
  async createUser(user: User): Promise<User> {
    try {
      const newUser = this.dataSource.getRepository(User).create(user);
      return await this.dataSource.getRepository(User).save(newUser);
    } catch (error) {
      console.error('Error creating user', error);
      throw new InternalServerErrorException('Error creating user: ' + error);
    }
  }

  /**
   * Update a user in the Postgres database
   *
   * @param user the user object to update with
   */
  async updateUser(user: User): Promise<void> {
    try {
      await this.dataSource.getRepository(User).update(
        { id: user.id },
        {
          name: user.name,
          email: user.email,
          picture: user.picture,
          refreshToken: user.refreshToken,
          accessToken: user.accessToken,
          expiresIn: user.expiresIn,
          refreshTokenExpiresIn: user.refreshTokenExpiresIn,
          tokenType: user.tokenType,
          scope: user.scope,
          idToken: user.idToken,
          balance: user.balance ?? 0,
        }
      );
    } catch (error) {
      console.error('Error updating user', error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  /**
   * Create a record of usage
   *
   * @param usage a usage record
   * @returns the created usage record
   */
  async createUsage(usage: Usage): Promise<Usage> {
    try {
      this.dataSource.getRepository(Usage).create(usage);
      return await this.dataSource.getRepository(Usage).save(usage);
    } catch (error) {
      console.log('Error storing usage log: ', error);
      throw new InternalServerErrorException('Error saving usage');
    }
  }

  /**
   * Find usage records by their user id
   *
   * @param userId the id of the user
   * @returns the usage records associated with the user
   */
  async findUsageRecordsByUserId(userId: string): Promise<Usage[] | null> {
    try {
      const result = await this.dataSource
        .getRepository(Usage)
        .createQueryBuilder('usage')
        .where('usage.userId = :userId', { userId })
        .getMany();
      return result || null;
    } catch (error) {
      console.error('Error finding usage by userId', error);
      throw new InternalServerErrorException('Error finding usage records');
    }
  }

  /**
   * Find Account record by customerId
   *
   * @param customerId the customerId associated with an account
   * @returns the account if exists
   */
  async findAccountByCustomerId(customerId: string): Promise<Account | null> {
    try {
      const result = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .where('account.customerId = :customerId', { customerId })
        .getOne();
      return result || null;
    } catch (error) {
      console.log('error finding the account by customerId: ', error);
      throw new InternalServerErrorException('Error finding account by customerId');
    }
  }

  /**
   * Find Account record by userId
   *
   * @param userId the userId associated with an account
   * @returns a list of accounts owned by the user
   */
  async findAccountsByUserId(userId: string): Promise<Account[]> {
    try {
      const result = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .where('account.userId = :userId', { userId })
        .getMany();
      return result;
    } catch (error) {
      console.log('error finding the account by customerId: ', error);
      throw new InternalServerErrorException('Error find account by userId');
    }
  }

  /**
   * Create a record for an account
   *
   * @param account an account record
   * @returns the created account record
   */
  async createAccount(account: Account): Promise<Account> {
    try {
      this.dataSource.getRepository(Account).create(account);
      return await this.dataSource.getRepository(Account).save(account);
    } catch (error) {
      console.log('Error storing account record: ', error);
      throw new InternalServerErrorException('Error saving account record');
    }
  }

  async updateLastSynced(customerId: string): Promise<void> {
    try {
      this.dataSource
        .getRepository(Account)
        .update({ customerId: customerId }, { lastSynced: new Date() });
    } catch (error) {
      console.log('Error updating last synced value: ', customerId);
      throw new InternalServerErrorException('Error updating last sync value');
    }
  }

  /**
   * Create a conversation record
   *
   */
  async createConversation(conversation: Conversation) {
    try {
      this.dataSource.getRepository(Conversation).create(conversation);
      return await this.dataSource.getRepository(Conversation).save(conversation);
    } catch (error) {
      console.log('Error creating conversation: ', error);
      throw new InternalServerErrorException('Error creating conversation');
    }
  }

  /**
   * Update a conversation
   *
   */
  async updateConversation(conversation: Conversation) {
    try {
      await this.dataSource.getRepository(Conversation).update(
        { id: conversation.id },
        {
          exchange: conversation.exchange,
        }
      );
    } catch (error) {
      console.log('Error updating conversation: ', error);
      throw new InternalServerErrorException('Error updating conversation');
    }
  }

  /**
   * Retrieve conversations by customerId and userId
   *
   * @param userId the id of the user
   * @param customerId the id of the Google Ads customer account
   * @returns a list of conversations associated to this user and customer
   */
  async findConversationsByUserIdAndCustomerId(
    userId: string,
    customerId: string
  ): Promise<Conversation[]> {
    try {
      const result = this.dataSource
        .getRepository(Conversation)
        .createQueryBuilder('conversation')
        .where('conversation.userId = :userId', { userId })
        .andWhere('conversation.customerId = :customerId', { customerId })
        .orderBy('conversation.createdAt', 'DESC')
        .getMany();

      return result;
    } catch (error) {
      console.log('Error finding conversations for userId and customerId: ', error);
      throw new InternalServerErrorException('Error retrieving conversations');
    }
  }

  /**
   * Retrieve a specific conversation by its id
   *
   * @param conversationId: number
   * @returns a conversaton object
   */
  async findConversationById(
    conversationId: number,
    userId: string,
    customerId: string
  ): Promise<Conversation> {
    try {
      const result = await this.dataSource
        .getRepository(Conversation)
        .createQueryBuilder('conversation')
        .where('conversation.user_id = :userId', { userId })
        .andWhere('conversation.id = :conversationId', { conversationId })
        .andWhere('conversation.customer_id = :customerId', { customerId })
        .getOne();

      return result;
    } catch (error) {
      console.log('Error finding conversation by id: ', error);
      throw new InternalServerErrorException('Failed to find conversation by id');
    }
  }

  /**
   * Create a record of transaction
   *
   * @param transaction a transaction entity
   * @returns the created transaction record
   */
  async createTransactionRecord(transaction: Transaction): Promise<Transaction> {
    try {
      this.dataSource.getRepository(Transaction).create(transaction);
      return await this.dataSource.getRepository(Transaction).save(transaction);
    } catch (error) {
      console.log('Error storing transaction: ', error);
      throw new InternalServerErrorException('Error saving transaction');
    }
  }

  /**
   * Retrieve a transaction record by session id
   *
   * @param sessionId the id of the Stripe session
   * @returns a transaction
   */
  async findTransactionBySessionId(sessionId: string): Promise<Transaction> {
    try {
      const result = await this.dataSource
        .getRepository(Transaction)
        .createQueryBuilder('transaction')
        .where('transaction.sessionId = :sessionId', { sessionId })
        .getOne();

      return result;
    } catch (error) {
      console.log('Transaction not found');
      return null;
    }
  }

  /**
   * Find multiple accounts by their customer IDs in a single query
   *
   * @param customerIds array of customer IDs to search for
   * @returns array of Account entities that match the customer IDs
   */
  async findAccountsByCustomerIds(customerIds: string[]): Promise<Account[]> {
    try {
      if (customerIds.length === 0) return [];

      const result = await this.dataSource
        .getRepository(Account)
        .createQueryBuilder('account')
        .where('account.customerId IN (:...customerIds)', { customerIds })
        .getMany();

      return result;
    } catch (error) {
      console.error('Error finding accounts by customer IDs:', error);
      throw new InternalServerErrorException('Error finding accounts by customer IDs');
    }
  }

  /**
   * Bulk insert multiple accounts in a single database operation
   *
   * @param accounts array of account objects to insert
   */
  async createAccountsBulk(accounts: Partial<Account>[]): Promise<void> {
    try {
      if (accounts.length === 0) return;

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Account)
        .values(accounts)
        .orIgnore() // Skip duplicates if they exist
        .execute();
    } catch (error) {
      console.error('Error bulk inserting accounts:', error);
      throw new InternalServerErrorException('Error bulk inserting accounts');
    }
  }

  /**
   * Find a specific conversation by ID and extract the latest 3 exchanges from it
   *
   * @param conversationId the id of the conversation
   * @param userId the id of the user
   * @param customerId the id of the Google Ads customer account
   * @returns an array of the latest 3 Exchange objects from the specified conversation
   */
  async findLatestThreeExchanges(
    conversationId: number,
    userId: string,
    customerId: string
  ): Promise<Exchange[]> {
    try {
      const conversation = await this.dataSource
        .getRepository(Conversation)
        .createQueryBuilder('conversation')
        .where('conversation.id = :conversationId', { conversationId })
        .andWhere('conversation.userId = :userId', { userId })
        .andWhere('conversation.customerId = :customerId', { customerId })
        .getOne();

      if (!conversation || !conversation.exchange || conversation.exchange.length === 0) {
        return [];
      }

      // Get the last 3 exchanges from the conversation (most recent ones)
      const exchanges = conversation.exchange;
      const latest3Exchanges = exchanges.slice(-3);

      return latest3Exchanges;
    } catch (error) {
      console.error('Error finding latest 3 exchanges from specified conversation:', error);
      throw new InternalServerErrorException('Error retrieving latest exchanges');
    }
  }
}
