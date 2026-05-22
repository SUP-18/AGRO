import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    # If no .env, load .env.example
    dotenv_example_path = os.path.join(os.path.dirname(__file__), '.env.example')
    if os.path.exists(dotenv_example_path):
        load_dotenv(dotenv_example_path)

from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
