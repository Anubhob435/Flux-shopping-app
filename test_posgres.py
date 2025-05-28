import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load environment variables from .env file
load_dotenv()

def test_postgres_connection():
    """Test PostgreSQL connection using environment variables."""
    
    print("Testing PostgreSQL Connection...")
    print("=" * 50)
    
    # Get connection details from environment variables
    database_url = os.getenv('DATABASE_URL')
    postgres_url = os.getenv('POSTGRES_URL')
    
    # Alternative individual connection parameters
    pg_host = os.getenv('PGHOST')
    pg_user = os.getenv('PGUSER')
    pg_password = os.getenv('PGPASSWORD')
    pg_database = os.getenv('PGDATABASE')
    pg_port = os.getenv('PGPORT', '5432')
    
    print(f"DATABASE_URL available: {'Yes' if database_url else 'No'}")
    print(f"POSTGRES_URL available: {'Yes' if postgres_url else 'No'}")
    print(f"Individual params available: {'Yes' if all([pg_host, pg_user, pg_password, pg_database]) else 'No'}")
    print()
    
    # Test connection using DATABASE_URL
    if database_url:
        try:
            print("Testing connection with DATABASE_URL...")
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor()
            
            # Test basic query
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Connection successful!")
            print(f"PostgreSQL version: {version[0]}")
            
            # Test database info
            cursor.execute("SELECT current_database(), current_user;")
            db_info = cursor.fetchone()
            print(f"Database: {db_info[0]}")
            print(f"User: {db_info[1]}")
            
            # Test table listing
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public';
            """)
            tables = cursor.fetchall()
            print(f"Tables in database: {len(tables)}")
            if tables:
                print("Table names:")
                for table in tables:
                    print(f"  - {table[0]}")
            else:
                print("No tables found in public schema")
            
            cursor.close()
            conn.close()
            print("Connection closed successfully.")
            return True
            
        except psycopg2.Error as e:
            print(f"❌ Database connection failed: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return False
    
    # Test connection using individual parameters
    elif all([pg_host, pg_user, pg_password, pg_database]):
        try:
            print("Testing connection with individual parameters...")
            conn = psycopg2.connect(
                host=pg_host,
                user=pg_user,
                password=pg_password,
                database=pg_database,
                port=pg_port
            )
            cursor = conn.cursor()
            
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Connection successful!")
            print(f"PostgreSQL version: {version[0]}")
            
            cursor.close()
            conn.close()
            return True
            
        except psycopg2.Error as e:
            print(f"❌ Database connection failed: {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return False
    
    else:
        print("❌ No valid PostgreSQL connection parameters found in environment variables.")
        print("Please ensure your .env file contains either:")
        print("1. DATABASE_URL or POSTGRES_URL")
        print("2. PGHOST, PGUSER, PGPASSWORD, PGDATABASE")
        return False

def test_connection_parameters():
    """Display available connection parameters for debugging."""
    print("\nConnection Parameters:")
    print("=" * 30)
    
    # Parse DATABASE_URL if available
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        try:
            parsed = urlparse(database_url)
            print(f"Host: {parsed.hostname}")
            print(f"Port: {parsed.port}")
            print(f"Database: {parsed.path[1:] if parsed.path else 'N/A'}")
            print(f"Username: {parsed.username}")
            print(f"SSL Mode: {'require' if 'sslmode=require' in database_url else 'not specified'}")
        except Exception as e:
            print(f"Error parsing DATABASE_URL: {e}")
    
    print(f"\nEnvironment Variables:")
    print(f"PGHOST: {os.getenv('PGHOST', 'Not set')}")
    print(f"PGUSER: {os.getenv('PGUSER', 'Not set')}")
    print(f"PGDATABASE: {os.getenv('PGDATABASE', 'Not set')}")
    print(f"PGPORT: {os.getenv('PGPORT', 'Not set')}")

if __name__ == "__main__":
    print("PostgreSQL Connection Test")
    print("=" * 50)
    
    # Check if psycopg2 is installed
    try:
        import psycopg2
        print("✅ psycopg2 module is available")
    except ImportError:
        print("❌ psycopg2 module not found. Install it with: pip install psycopg2-binary")
        exit(1)
    
    print()
    
    # Test the connection
    success = test_postgres_connection()
    
    # Show connection parameters for debugging
    test_connection_parameters()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ PostgreSQL connection test completed successfully!")
    else:
        print("❌ PostgreSQL connection test failed!")