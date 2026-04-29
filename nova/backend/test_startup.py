import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("Testing imports...")
try:
    from app.main import app
    print("Successfully imported app")
except Exception as e:
    print(f"Error importing app: {e}")
    import traceback
    traceback.print_exc()

print("\nTesting database connection (engine only)...")
try:
    from app.database import engine
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("Database connection successful!")
except Exception as e:
    print(f"Database connection failed: {e}")
