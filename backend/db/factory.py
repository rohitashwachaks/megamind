from typing import Dict

from .base import DatabaseConnector

# Import your concrete implementations here
from .sql import SqlConnector
from .mongo import MongoConnector


_connectors: Dict[str, DatabaseConnector] = {
    "sql": SqlConnector(),
    "mongo": MongoConnector(),
}


def get_db_connector(connector_type: str = "sql") -> DatabaseConnector:
    """Factory function to get a database connector."""
    connector = _connectors.get(connector_type)
    if not connector:
        raise ValueError(f"Unsupported database connector type: {connector_type}")
    return connector
