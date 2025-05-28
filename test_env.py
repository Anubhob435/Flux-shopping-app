from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

print("Environment variables loaded:")
print(f"MYSQL_HOST: {os.getenv('MYSQL_HOST')}")
print(f"MYSQL_USER: {os.getenv('MYSQL_USER')}")
print(f"MYSQL_DATABASE: {os.getenv('MYSQL_DATABASE')}")
print(f"FLASK_SECRET_KEY: {os.getenv('FLASK_SECRET_KEY')}")

# Check if all required variables are present
required_vars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE', 'FLASK_SECRET_KEY']
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    print(f"Missing environment variables: {missing_vars}")
else:
    print("All required environment variables are present!")
