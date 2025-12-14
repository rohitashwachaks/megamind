from typing import Dict

from backend.db.base import DatabaseConnector

# Import your concrete implementations here
from backend.db.sql import SqlConnector
from backend.db.mongo import MongoConnector


_connectors: Dict[str, DatabaseConnector] = {
    "sql": SqlConnector(),
    "mongo": MongoConnector(),
}


def get_db_connector(connector_type: str = "mongo") -> DatabaseConnector:
    """Factory function to get a database connector."""
    connector = _connectors.get(connector_type)
    if not connector:
        raise ValueError(f"Unsupported database connector type: {connector_type}")
    return connector
