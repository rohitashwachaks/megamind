# Quick Setup Guide - Megamind PWA

This guide will help you get the Megamind application running locally in under 5 minutes.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Python 3.8 or higher installed
- [ ] Node.js 18 or higher installed
- [ ] Docker installed (for MongoDB) OR MongoDB installed locally

Check versions:
```bash
python3 --version
node --version
docker --version
```

## Step-by-Step Setup

### Step 1: Clone and Navigate
```bash
git clone <your-repo-url>
cd megamind
```

### Step 2: Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name megamind-mongo mongo:latest
```

**Option B: Using Local MongoDB**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Step 3: Setup Backend

Open a new terminal window:

```bash
# Navigate to project root
cd megamind

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Seed the database with initial data
python3 backend/db/seed_mongo.py

# Start the Flask backend
python3 backend/app.py
```

You should see:
```
INFO:__main__:CORS configured for origins: ['*']
INFO:__main__:Starting Flask app on port 8000 (debug=True)
 * Running on http://127.0.0.1:8000
```

**Keep this terminal running!**

### Step 4: Setup Frontend

Open a **new terminal window**:

```bash
# Navigate to project root
cd megamind

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

You should see:
```
  VITE v7.2.4  ready in 302 ms

  ➜  Local:   http://localhost:5173/
```

**Keep this terminal running too!**

### Step 5: Access the App

Open your browser and go to:
```
http://localhost:5173
```

You should see the Megamind dashboard with 3 sample courses!

## Verification

### Test the Backend API
```bash
# In a new terminal
curl http://localhost:8000/api/v1/health
```

Expected response:
```json
{
  "data": {"status": "ok"},
  "meta": {"traceId": "..."}
}
```

### Test MongoDB Connection
```bash
# List databases
docker exec -it megamind-mongo mongosh --eval "show dbs"

# Check data
docker exec -it megamind-mongo mongosh megamind --eval "db.courses.countDocuments()"
```

Expected: Should show 3 courses

## Common Issues & Solutions

### Issue: "Connection refused" when accessing backend

**Solution:**
```bash
# Check if backend is running
ps aux | grep "python.*app.py"

# If not running, start it
cd megamind
source .venv/bin/activate
python3 backend/app.py
```

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Solution:**
```bash
# Ensure virtual environment is activated
source .venv/bin/activate  # You should see (.venv) in your prompt

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Issue: "pymongo.errors.ServerSelectionTimeoutError"

**Solution:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# If not, start it
docker start megamind-mongo

# Or run a new container
docker run -d -p 27017:27017 --name megamind-mongo mongo:latest
```

### Issue: Frontend shows "Failed to fetch"

**Solution:**
1. Verify backend is running on port 8000
2. Check browser console for CORS errors
3. Try accessing http://localhost:8000/api/v1/health directly

### Issue: Port 8000 or 5173 already in use

**Solution:**

For backend (port 8000):
```bash
# Create backend/.env file
echo "FLASK_PORT=8001" > backend/.env

# Restart backend
python3 backend/app.py
```

For frontend (port 5173):
```bash
# Vite will automatically use the next available port
# Just note the new port shown in terminal
```

## Next Steps

Once running successfully:

1. **Explore the app:**
   - View the dashboard
   - Click on a course
   - Mark a lecture as complete
   - Add a new course

2. **Customize data:**
   - Edit `backend/data/seed.json`
   - Re-run `python3 backend/db/seed_mongo.py`
   - Refresh the browser

3. **Install as PWA:**
   - On Chrome: Menu → Install app
   - On Safari (iOS): Share → Add to Home Screen

4. **Read documentation:**
   - [Product Design](docs/design.md)
   - [Code Review](docs/CODE_REVIEW.md)
   - [API Schemas](docs/rest_api_common_schemas.md)

## Development Workflow

### Making Backend Changes
```bash
# Backend auto-reloads in debug mode
# Just save your Python file and Flask will restart
```

### Making Frontend Changes
```bash
# Vite has hot module replacement (HMR)
# Changes appear instantly in the browser
```

### Stopping Everything
```bash
# Stop backend: Ctrl+C in backend terminal
# Stop frontend: Ctrl+C in frontend terminal
# Stop MongoDB:
docker stop megamind-mongo
```

### Restarting Later
```bash
# Start MongoDB
docker start megamind-mongo

# Terminal 1: Backend
cd megamind
source .venv/bin/activate
python3 backend/app.py

# Terminal 2: Frontend
cd megamind
npm run dev
```

## Need Help?

- Check [CODE_REVIEW.md](docs/CODE_REVIEW.md) for known issues
- Review [technical_implementation.md](docs/technical_implementation.md) for architecture
- Open an issue on GitHub

Happy coding! 🚀
