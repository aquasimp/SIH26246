# KaushalYuva One-Command Launch Script (Windows PowerShell)
# Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  KaushalYuva Analytical Platform — Starting Services    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ROOT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Setup / Verify Python Environment
if (-Not (Test-Path "$ROOT_DIR\.venv")) {
    Write-Host "[1/4] Creating Python virtual environment (.venv)..." -ForegroundColor Yellow
    python -m venv "$ROOT_DIR\.venv"
}

$PYTHON = "$ROOT_DIR\.venv\Scripts\python.exe"
$PIP = "$ROOT_DIR\.venv\Scripts\pip.exe"

Write-Host "[2/4] Verifying Python dependencies..." -ForegroundColor Yellow
& $PIP install -q -r "$ROOT_DIR\requirements.txt"

# 2. Start FastAPI Backend in Background
Write-Host "[3/4] Launching FastAPI analytical backend on http://127.0.0.1:8000..." -ForegroundColor Green
$backendJob = Start-Job -ScriptBlock {
    param($root, $py)
    Set-Location $root
    $env:PYTHONPATH = $root
    & $py -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
} -ArgumentList $ROOT_DIR, $PYTHON

# 3. Setup and Launch Frontend
Write-Host "[4/4] Launching Next.js frontend on http://localhost:3000..." -ForegroundColor Green
Set-Location "$ROOT_DIR\frontend"
if (-Not (Test-Path "$ROOT_DIR\frontend\node_modules")) {
    Write-Host "Installing frontend dependencies (npm install)..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  KaushalYuva is running!" -ForegroundColor Cyan
Write-Host "  - Frontend UI: http://localhost:3000" -ForegroundColor Green
Write-Host "  - Analytical API: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop the frontend." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

try {
    npm run dev
} finally {
    Write-Host "Stopping backend service..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
}
