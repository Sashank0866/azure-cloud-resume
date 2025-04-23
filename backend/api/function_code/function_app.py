import azure.functions as func
import logging
import uuid
import os
from datetime import datetime
from azure.data.tables import TableClient, UpdateMode

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="http_trigger", methods=["GET", "POST"])
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Logging and updating visit count using TableClient.")

    # Retrieve connection string from environment variable.
    connection_string = os.environ.get("COSMOS_TABLE_CONNECTION")
    if not connection_string:
        return func.HttpResponse("COSMOS_TABLE_CONNECTION environment variable is not set", status_code=500)
    
    table_name = "visit_count"

    # Create TableClient using the connection string.
    table_client = TableClient.from_connection_string(conn_str=connection_string, table_name=table_name)

    # 1. Insert a Visit Log entity.
    visit = {
        "PartitionKey": "visit_log",
        "RowKey": datetime.utcnow().strftime("%Y%m%d%H%M%S") + "-" + str(uuid.uuid4())[:6],
        "page": req.params.get("page", "/") or "/",
        "visit_time": datetime.utcnow().isoformat(),
        "user_agent": req.headers.get("User-Agent", "unknown"),
        "ip_address": req.headers.get("X-Forwarded-For", "unknown")
    }
    try:
        table_client.create_entity(entity=visit)
    except Exception as e:
        logging.error(f"Error inserting visit entity: {e}")
        return func.HttpResponse("Error logging visit", status_code=500)

    # 2. Read and Increment the Counter.
    try:
        counter = table_client.get_entity(partition_key="counter", row_key="visit_total")
    except Exception as e:
        logging.error(f"Error reading counter: {e}")
        # If the counter doesn't exist, initialize it.
        counter = {
            "PartitionKey": "counter",
            "RowKey": "visit_total",
            "count": 0,
            "last_updated": datetime.utcnow().isoformat()
        }
        try:
            table_client.create_entity(entity=counter)
        except Exception as ce:
            logging.error(f"Error creating new counter entity: {ce}")
            return func.HttpResponse("Error initializing counter", status_code=500)

    try:
        new_count = int(counter.get("count", 0)) + 1
        counter["count"] = new_count
        counter["last_updated"] = datetime.utcnow().isoformat()
        table_client.update_entity(entity=counter, mode=UpdateMode.MERGE)
    except Exception as e:
        logging.error(f"Error updating counter: {e}")
        return func.HttpResponse("Error updating counter", status_code=500)

    # 3. Return the updated counter value.
    return func.HttpResponse(f"{counter['count']}", status_code=200)