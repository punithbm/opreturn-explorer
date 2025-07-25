#!/bin/bash

echo "🚀 Starting Bitcoin Bomber OP_RETURN Explorer..."

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && pnpm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && pnpm install && cd ..
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
pnpm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
pnpm dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started successfully!"
echo "🔌 Backend API: http://localhost:3001"
echo "🌐 Frontend App: http://localhost:3000"
echo "💣 Bitcoin Bomber is ready to explore OP_RETURN data!"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Keep script running
wait 