# Backend
# Mongo
# docker run --name mongodb -p 27017:27017 -v /Users/rchaks/Code/GitHub/megamind/backend/data:/data/db mongo

# Python
# python3 -m venv .venv && source .venv/bin/activate
# pip install -r backend/requirements.txt
python -m backend.app  # serves http://localhost:8000/api/v1