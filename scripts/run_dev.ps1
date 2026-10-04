# KaushalPulse Quick Launch Script for Local Development
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   KaushalPulse - Labour Market Intelligence Engine (MSDE) " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\..\frontend"
Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
npm run dev
