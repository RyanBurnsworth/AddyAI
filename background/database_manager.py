import psycopg2
from typing import List, Tuple, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, connection_params: dict):
        self.connection_params = connection_params
    
    def get_connection(self):
        """Get a database connection"""
        return psycopg2.connect(**self.connection_params)
    
    def get_user_account_data(self) -> List[Tuple[str, str, Optional[str]]]:
        """
        Extract refresh_token, customer_id, and manager_id for all users.
        
        Returns:
            List of tuples containing (refresh_token, customer_id, manager_id, user_id)
        """
        try:
            conn = self.get_connection()
            cur = conn.cursor()

            query = """
            SELECT 
                u.refresh_token,
                a.customer_id,
                a.manager_id,
                u.id as user_id
            FROM "User" u
            INNER JOIN account a ON u.id = a.user_id
            WHERE u.refresh_token IS NOT NULL
            ORDER BY u.id;
            """

            cur.execute(query)
            results = cur.fetchall()

            logger.info(f"Retrieved {len(results)} google ads accounts from database")
            return results

        except psycopg2.Error as e:
            logger.error(f"Database error retrieving google ads accounts: {e}")
            return []
        
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    def get_user_credentials(self, customer_id: str) -> dict:
        """
        Get Google Ads credentials for a specific customer
        
        Args:
            customer_id: The Google Ads customer ID
            
        Returns:
            Dictionary with credentials or None if not found
        """
        try:
            conn = self.get_connection()
            cur = conn.cursor()

            query = """
            SELECT 
                u.refresh_token,
                u.id as user_id
            FROM "User" u
            INNER JOIN account a ON u.id = a.user_id
            WHERE a.customer_id = %s
            """

            cur.execute(query, (customer_id,))
            result = cur.fetchone()
            
            if result:
                # Fixed: Only unpack the 2 values that are actually returned
                refresh_token, user_id = result
                return {
                    "developer_token": "<Your Developer Token",  # Your dev token
                    "client_id": "<Your Client ID>",  # Your OAuth2 client ID
                    "client_secret": "<Your Client Secret>",  # Your OAuth2 client secret
                    "refresh_token": refresh_token,
                    "use_proto_plus": True,
                    "user_id": user_id
                }
            else:
                logger.warning(f"No credentials found for customer_id: {customer_id}")
                return None

        except psycopg2.Error as e:
            logger.error(f"Database error retrieving credentials for {customer_id}: {e}")
            return None
        
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    def update_last_synced(self, customer_id: str):
        """
        Update the last_synced timestamp for an account
        
        Args:
            customer_id: The Google Ads customer ID
        """
        try:
            conn = self.get_connection()
            cur = conn.cursor()

            update_query = """
            UPDATE account 
            SET last_synced = %s 
            WHERE customer_id = %s
            """

            cur.execute(update_query, (datetime.now(), customer_id))
            conn.commit()
            
            logger.info(f"Updated last_synced for customer {customer_id}")

        except psycopg2.Error as e:
            logger.error(f"Database error updating last_synced for {customer_id}: {e}")
        
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    def execute_batch_insert(self, sql: str, data_batch: List[tuple]):
        """
        Execute a batch insert operation
        
        Args:
            sql: The SQL insert statement
            data_batch: List of tuples containing the data to insert
        """
        if not data_batch:
            return
            
        try:
            conn = self.get_connection()
            cur = conn.cursor()
            
            cur.executemany(sql, data_batch)
            conn.commit()
            
            logger.info(f"Successfully inserted {len(data_batch)} records")

        except psycopg2.Error as e:
            logger.error(f"Database error during batch insert: {e}")
            raise
        
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    def execute_batch_update(self, sql: str, data_batch: List[tuple]):
        """
        Execute a batch update operation
        
        Args:
            sql: The SQL update statement
            data_batch: List of tuples containing the data to update
        """
        if not data_batch:
            return
            
        try:
            conn = self.get_connection()
            cur = conn.cursor()
            
            cur.executemany(sql, data_batch)
            conn.commit()
            
            logger.info(f"Successfully updated {len(data_batch)} records")

        except psycopg2.Error as e:
            logger.error(f"Database error during batch update: {e}")
            raise
        
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()