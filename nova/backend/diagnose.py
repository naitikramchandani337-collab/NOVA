import sys
import os

print("Starting diagnostic test...")
try:
    import fastapi
    print("FastAPI found")
    import openai
    print("OpenAI found")
    
    # Try to import app components
    print("Importing app.schemas...")
    import app.schemas
    print("Importing app.config...")
    import app.config
    print("Importing app.services.ai_service...")
    import app.services.ai_service
    print("Importing app.routers.astra...")
    import app.routers.astra
    print("Importing app.main...")
    import app.main
    
    print("\nSUCCESS: All components imported correctly.")
except Exception as e:
    print(f"\nFAILURE: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
