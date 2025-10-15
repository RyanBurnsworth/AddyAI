#!/usr/bin/env python3
"""
Google Ads Data Sync Script

This script syncs Google Ads metrics and attributes data for all users in the database.
It processes data from YESTERDAY and updates the last_synced timestamp for each account.
"""

import logging
import logging.config
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Tuple
import sys
import argparse
from datetime import datetime

# Import our modules
from config import DATABASE_CONFIG, PROCESSING_CONFIG, LOGGING_CONFIG
from database_manager import DatabaseManager
from data_processor import DataProcessor
from entities import METRIC_ENTITIES, ATTR_ENTITIES

def setup_logging():
    """Setup logging configuration"""
    logging.config.dictConfig(LOGGING_CONFIG)
    return logging.getLogger(__name__)

def sync_single_customer(args: Tuple[str, int, DataProcessor]) -> Tuple[str, bool]:
    """
    Sync data for a single customer
    
    Args:
        args: Tuple containing (customer_id, user_id, data_processor)
        
    Returns:
        Tuple of (customer_id, success_flag)
    """
    customer_id, user_id, processor = args
    
    try:
        success = processor.sync_customer_data(
            customer_id=customer_id,
            user_id=user_id,
            metrics_entities=METRIC_ENTITIES,
            attributes_entities=ATTR_ENTITIES
        )
        return customer_id, success
    except Exception as e:
        logging.error(f"Unexpected error syncing customer {customer_id}: {e}")
        return customer_id, False

def run_sync(max_workers: int = None, specific_customer: str = None):
    """
    Main sync function
    
    Args:
        max_workers: Maximum number of worker threads (default from config)
        specific_customer: If provided, only sync this customer ID
    """
    logger = logging.getLogger(__name__)
    
    # Initialize database manager
    db_manager = DatabaseManager(DATABASE_CONFIG)
    
    # Get all user accounts
    if specific_customer:
        logger.info(f"Syncing specific customer: {specific_customer}")
        # You might want to add a method to get specific customer data
        user_accounts = [(None, specific_customer, None, None)]  # Simplified for demo
    else:
        logger.info("Retrieving all user accounts from database")
        user_accounts = db_manager.get_user_account_data()
    
    if not user_accounts:
        logger.warning("No user accounts found to sync")
        return
    
    logger.info(f"Found {len(user_accounts)} accounts to sync")
    
    # Initialize data processor
    processor = DataProcessor(db_manager)
    
    # Prepare arguments for parallel processing
    sync_args = [
        (customer_id, user_id, processor) 
        for refresh_token, customer_id, manager_id, user_id in user_accounts
        if customer_id  # Only process accounts with customer_id
    ]
    
    if not sync_args:
        logger.warning("No valid customer IDs found to sync")
        return
    
    # Use configured max_workers or default
    max_workers = max_workers or PROCESSING_CONFIG['max_workers']
    
    # Track results
    successful_syncs = []
    failed_syncs = []
    
    # Process accounts in parallel
    logger.info(f"Starting parallel sync with {max_workers} workers")
    start_time = datetime.now()
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_customer = {
            executor.submit(sync_single_customer, args): args[0] 
            for args in sync_args
        }
        
        # Process completed tasks
        for future in as_completed(future_to_customer):
            customer_id = future_to_customer[future]
            try:
                result_customer_id, success = future.result()
                if success:
                    successful_syncs.append(result_customer_id)
                    logger.info(f"✓ Successfully synced customer {result_customer_id}")
                else:
                    failed_syncs.append(result_customer_id)
                    logger.error(f"✗ Failed to sync customer {result_customer_id}")
            except Exception as e:
                failed_syncs.append(customer_id)
                logger.error(f"✗ Exception syncing customer {customer_id}: {e}")
    
    # Log summary
    end_time = datetime.now()
    duration = end_time - start_time
    
    logger.info("=" * 60)
    logger.info("SYNC SUMMARY")
    logger.info("=" * 60)
    logger.info(f"Total accounts processed: {len(sync_args)}")
    logger.info(f"Successful syncs: {len(successful_syncs)}")
    logger.info(f"Failed syncs: {len(failed_syncs)}")
    logger.info(f"Duration: {duration}")
    
    if failed_syncs:
        logger.error(f"Failed customer IDs: {', '.join(failed_syncs)}")
    
    logger.info("Sync process completed")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Sync Google Ads data for all users')
    parser.add_argument('--max-workers', type=int, help='Maximum number of worker threads')
    parser.add_argument('--customer-id', type=str, help='Sync specific customer ID only')
    parser.add_argument('--log-level', choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'], 
                       default='INFO', help='Set logging level')
    
    args = parser.parse_args()
    
    # Setup logging
    setup_logging()
    logger = logging.getLogger(__name__)
    
    # Set log level if specified
    if args.log_level:
        logging.getLogger().setLevel(getattr(logging, args.log_level))
    
    logger.info("Starting Google Ads data sync process")
    logger.info(f"Configuration: max_workers={args.max_workers or PROCESSING_CONFIG['max_workers']}")
    
    try:
        run_sync(max_workers=args.max_workers, specific_customer=args.customer_id)
    except KeyboardInterrupt:
        logger.info("Sync process interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Fatal error in sync process: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()