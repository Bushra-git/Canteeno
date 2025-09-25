#!/usr/bin/env pwsh

Write-Host "=== CANTEEN SYSTEM SETUP AND STARTUP ===" -ForegroundColor Cyan

# 1. Setup database with test data
Write-Host "`n1. Setting up database with test orders..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "root"
    psql -U postgres -d canteen_db -f "backend\test_orders.sql"
    Write-Host "✅ Test orders added to database" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not add test orders: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 2. Build backend
Write-Host "`n2. Building backend..." -ForegroundColor Yellow
try {
    Set-Location "backend"
    npm run build
    Write-Host "✅ Backend built successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend build failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Set-Location ".."
}

# 3. Start servers
Write-Host "`n3. Starting servers..." -ForegroundColor Yellow

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor White
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\DELL\Downloads\Canteen Management System Design\backend"
    npm start
}

Start-Sleep -Seconds 3

# Start frontend in background  
Write-Host "Starting frontend server..." -ForegroundColor White
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\DELL\Downloads\Canteen Management System Design"
    npm run dev
}

Start-Sleep -Seconds 5

# 4. Test system
Write-Host "`n4. Testing system..." -ForegroundColor Yellow
try {
    # Test backend
    $response = Invoke-WebRequest -Uri "http://localhost:4000/" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend server is running on port 4000" -ForegroundColor Green
    
    # Test kitchen login
    $loginData = @{
        identifier = "kitchen"
        password = "password"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Kitchen authentication working" -ForegroundColor Green
    
    # Test kitchen orders
    $ordersResponse = Invoke-RestMethod -Uri "http://localhost:4000/kitchen/orders" -Method GET -Headers @{"Authorization"="Bearer $($loginResponse.token)"} -TimeoutSec 10
    Write-Host "✅ Kitchen orders API working - Found $($ordersResponse.Count) orders" -ForegroundColor Green
    
    Write-Host "`n🎉 SYSTEM IS READY!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "`n📱 Frontend: http://localhost:3000/" -ForegroundColor Cyan
    Write-Host "🔧 Backend:  http://localhost:4000/" -ForegroundColor Cyan
    Write-Host "`n🔑 Test Credentials:" -ForegroundColor Yellow
    Write-Host "   Kitchen: username='kitchen', password='password'" -ForegroundColor White
    Write-Host "   Admin:   username='admin', password='password'" -ForegroundColor White
    Write-Host "   Student: username='user1', password='password'" -ForegroundColor White
    
} catch {
    Write-Host "❌ System test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check that all services are running properly." -ForegroundColor Yellow
}

Write-Host "`nPress Ctrl+C to stop servers..." -ForegroundColor Gray
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "`nStopping servers..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue  
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
}