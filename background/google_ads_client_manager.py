from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import logging

logger = logging.getLogger(__name__)

class GoogleAdsClientManager:
    def __init__(self, credentials: dict):
        self.credentials = credentials
        self.client = None
        self.user_id = credentials.get('user_id')
        
    def get_client(self):
        """Get or create Google Ads client"""
        if not self.client:
            try:
                self.client = GoogleAdsClient.load_from_dict(self.credentials)
                logger.info(f"Created Google Ads client for user {self.user_id}")
            except Exception as e:
                logger.error(f"Failed to create Google Ads client for user {self.user_id}: {e}")
                raise
        return self.client
    
    def execute_query(self, customer_id: str, query: str):
        """
        Execute a Google Ads query and return results
        
        Args:
            customer_id: The Google Ads customer ID
            query: The GAQL query string
            
        Yields:
            Query results
        """
        try:
            client = self.get_client()
            ga_service = client.get_service('GoogleAdsService')
            
            logger.info(f"Executing query for customer {customer_id}")
            logger.debug(f"Query: {query}")
            
            stream = ga_service.search_stream(
                customer_id=customer_id,
                query=query
            )
            
            for batch in stream:
                for row in batch.results:
                    yield row
                    
        except GoogleAdsException as ex:
            logger.error(f"Google Ads API error for customer {customer_id}: {ex}")
            for error in ex.failure.errors:
                logger.error(f"Error: {error.error_code.name}: {error.message}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error executing query for customer {customer_id}: {e}")
            raise