#!/usr/bin/env bash
# KaushalPulse One-Command Launch Script (Linux / macOS)
# Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "  KaushalPulse Analytical Platform — Starting Services    "
echo "=========================================================="

# 1. Setup / Verify Python Environment
if [ ! -d "$ROOT_DIR/.venv" ]; then
    echo "[1/4] Creating Python virtual environment (.venv)..."
    python3 -m venv "$ROOT_DIR/.venv"
fi

source "$ROOT_DIR/.venv/bin/activate"

echo "[2/4] Verifying Python dependencies..."
pip install -q -r "$ROOT_DIR/requirements.txt"

# 2. Start FastAPI Backend in Background
echo "[3/4] Launching FastAPI analytical backend on http://127.0.0.1:8000..."
export PYTHONPATH="$ROOT_DIR"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cleanup() {
    echo ""
    echo "Stopping analytical backend (PID $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 3. Setup and Launch Frontend
echo "[4/4] Launching Next.js frontend on http://localhost:3000..."
cd "$ROOT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (npm install)..."
    npm install
fi

echo ""
echo "=========================================================="
echo "  KaushalPulse is running!"
echo "  - Frontend UI: http://localhost:3000"
echo "  - Analytical API: http://127.0.0.1:8000/docs"
echo "  Press Ctrl+C to stop both services."
echo "=========================================================="
echo ""

npm run dev
