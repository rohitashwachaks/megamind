#!/bin/bash

# Script to run both frontend and backend simultaneously
# Frontend runs on http://localhost:5173
# Backend runs on http://localhost:8000

echo "Starting MegaMind development servers..."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo "Press Ctrl+C to stop both servers"

# Kill any existing processes on ports 8000 and 5173
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start backend in background
echo "Starting backend..."
python3 -m backend.app &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start!"
    exit 1
fi

# Start frontend in background
echo "Starting frontend..."
npm run dev --host &
FRONTEND_PID=$!

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    
    # Force kill if still running after 2 seconds
    sleep 2
    kill -9 $BACKEND_PID 2>/dev/null || true
    kill -9 $FRONTEND_PID 2>/dev/null || true
    
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers for proper cleanup
trap cleanup SIGINT SIGTERM EXIT

echo "✅ Both servers started successfully!"

# Wait for both processes
wait
