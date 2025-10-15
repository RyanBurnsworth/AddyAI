import os
from typing import Dict

# Database configuration
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'addyai_db'),
    'user': os.getenv('DB_USER', 'addyai'),
    'password': os.getenv('DB_PASSWORD', '<Your Password>'),
    'port': int(os.getenv('DB_PORT', 5432))
}

# Google Ads API configuration
GOOGLE_ADS_CONFIG = {
    'developer_token': os.getenv('GOOGLE_ADS_DEVELOPER_TOKEN', '<Your Developer Token>'),
    'default_client_id': os.getenv('GOOGLE_ADS_CLIENT_ID', '<Your Client ID>'),
    'default_client_secret': os.getenv('GOOGLE_ADS_CLIENT_SECRET', '<Your Client Secret>'),
}

# Processing configuration
PROCESSING_CONFIG = {
    'max_workers': int(os.getenv('MAX_WORKERS', 5)),
    'batch_size': int(os.getenv('BATCH_SIZE', 1000)),
    'timeout_seconds': int(os.getenv('TIMEOUT_SECONDS', 300))
}

# Logging configuration
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
        'detailed': {
            'format': '%(asctime)s [%(levelname)s] %(name)s:%(lineno)d: %(message)s'
        }
    },
    'handlers': {
        'default': {
            'level': 'INFO',
            'formatter': 'standard',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout'
        },
        'file': {
            'level': 'DEBUG',
            'formatter': 'detailed',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'google_ads_sync.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5
        }
    },
    'loggers': {
        '': {  # root logger
            'handlers': ['default', 'file'],
            'level': 'DEBUG',
            'propagate': False
        }
    }
}