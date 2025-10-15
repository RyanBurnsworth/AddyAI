from typing import List, Dict, Any
import logging
from database_manager import DatabaseManager
from google_ads_client_manager import GoogleAdsClientManager

logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        
    def process_metrics_entity(self, client_manager: GoogleAdsClientManager, 
                             customer_id: str, entity: Dict[str, Any]):
        """
        Process a metrics entity for a specific customer
        
        Args:
            client_manager: Google Ads client manager
            customer_id: The Google Ads customer ID
            entity: Entity configuration dictionary
        """
        logger.info(f"Processing {entity['name']} metrics for customer {customer_id}")
        
        try:
            query = entity["query"]
            insert_sql = entity["insert_sql"]
            extract_fields = entity["extract_fields"]
            
            # Collect all data first
            data_batch = []
            
            for row in client_manager.execute_query(customer_id, query):
                try:
                    # Extract fields and add user_id
                    extracted_data = list(extract_fields(row))
                    
                    # Set user_id (typically at index 1 for metrics)
                    if len(extracted_data) > 1 and extracted_data[1] is None:
                        extracted_data[1] = client_manager.user_id
                    
                    data_batch.append(tuple(extracted_data))
                    
                except Exception as e:
                    logger.error(f"Error extracting fields from row for {entity['name']}: {e}")
                    continue
            
            # Batch insert all data
            if data_batch:
                self.db_manager.execute_batch_insert(insert_sql, data_batch)
                logger.info(f"Processed {len(data_batch)} {entity['name']} records for customer {customer_id}")
            else:
                logger.warning(f"No data found for {entity['name']} for customer {customer_id}")
                
        except Exception as e:
            logger.error(f"Error processing {entity['name']} for customer {customer_id}: {e}")
            raise

    def process_attributes_entity(self, client_manager: GoogleAdsClientManager, 
                                customer_id: str, entity: Dict[str, Any]):
        """
        Process an attributes entity for a specific customer
        
        Args:
            client_manager: Google Ads client manager
            customer_id: The Google Ads customer ID
            entity: Entity configuration dictionary
        """
        logger.info(f"Processing {entity['name']} attributes for customer {customer_id}")
        
        try:
            query = entity["query"]
            update_sql = entity["update_sql"]
            extract_fields = entity["extract_fields"]
            
            # Collect all data first
            data_batch = []
            
            for row in client_manager.execute_query(customer_id, query):
                try:
                    # Extract fields and add user_id
                    extracted_data = list(extract_fields(row))
                    
                    # Set user_id (typically at the end for attributes)
                    if len(extracted_data) > 0 and extracted_data[-1] is None:
                        extracted_data[-1] = client_manager.user_id
                    
                    data_batch.append(tuple(extracted_data))
                    
                except Exception as e:
                    logger.error(f"Error extracting fields from row for {entity['name']}: {e}")
                    continue
            
            # Batch update all data
            if data_batch:
                self.db_manager.execute_batch_update(update_sql, data_batch)
                logger.info(f"Processed {len(data_batch)} {entity['name']} records for customer {customer_id}")
            else:
                logger.warning(f"No data found for {entity['name']} for customer {customer_id}")
                
        except Exception as e:
            logger.error(f"Error processing {entity['name']} for customer {customer_id}: {e}")
            raise

    """
    Sync all data for a specific customer
    
    Args:
        customer_id: The Google Ads customer ID
        user_id: The user ID from database
        metrics_entities: List of metrics entity configurations
        attributes_entities: List of attributes entity configurations
    """
    def sync_customer_data(self, customer_id: str, user_id: int, 
                          metrics_entities: List[Dict], 
                          attributes_entities: List[Dict]):

        logger.info(f"Starting sync for customer {customer_id}")
        
        try:
            # Get credentials for this customer
            credentials = self.db_manager.get_user_credentials(customer_id)
            if not credentials:
                logger.error(f"No credentials found for customer {customer_id}")
                return False
                
            # Create Google Ads client manager
            client_manager = GoogleAdsClientManager(credentials)
            
            # Process all metrics entities
            for entity in metrics_entities:
                try:
                    self.process_metrics_entity(client_manager, customer_id, entity)
                    print("WE MADE IT HERE")
                except Exception as e:
                    logger.error(f"Failed to process metrics entity {entity['name']} for customer {customer_id}: {e}")
                    # Continue with other entities
                    
            # Process all attributes entities
            for entity in attributes_entities:
                try:
                    self.process_attributes_entity(client_manager, customer_id, entity)
                except Exception as e:
                    logger.error(f"Failed to process attributes entity {entity['name']} for customer {customer_id}: {e}")
                    # Continue with other entities
            
            # Update last_synced timestamp
            self.db_manager.update_last_synced(customer_id)
            
            logger.info(f"Successfully completed sync for customer {customer_id}")
            return True
            
        except Exception as e:
            logger.error(f"customerId, userId, metrics_entities, attributes_entities {customer_id}, {user_id}, {len(metrics_entities)}, {len(attributes_entities)}")
            logger.error(f"Fatal error syncing customer {customer_id}: {e}")
            return False