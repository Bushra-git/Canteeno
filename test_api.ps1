#!/usr/bin/env pwsh

Write-Host "Testing backend API endpoints..." -ForegroundColor Yellow

try {
    # Test 1: Basic connectivity
    Write-Host "`n1. Testing basic connectivity..." -ForegroundColor White
    $response = Invoke-WebRequest -Uri "http://localhost:4000/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is responding: $($response.StatusCode)" -ForegroundColor Green

    # Test 2: Login endpoint
    Write-Host "`n2. Testing login endpoint..." -ForegroundColor White
    $loginData = @{
        identifier = "admin"
        password = "password"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Login successful for user: $($loginResponse.user.username)" -ForegroundColor Green

    # Test 3: Menu items endpoint
    Write-Host "`n3. Testing menu items endpoint..." -ForegroundColor White
    $menuResponse = Invoke-RestMethod -Uri "http://localhost:4000/menu_items" -Method GET -TimeoutSec 10
    Write-Host "✅ Menu items loaded: $($menuResponse.Count) items" -ForegroundColor Green

    Write-Host "`n🎉 All API endpoints are working!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "`n📝 You can now:" -ForegroundColor Cyan
    Write-Host "   1. Open http://localhost:3000/ in your browser" -ForegroundColor White
    Write-Host "   2. Try signing up with new credentials" -ForegroundColor White
    Write-Host "   3. Or login with existing users:" -ForegroundColor White
    Write-Host "      - Admin: admin / password" -ForegroundColor Gray
    Write-Host "      - Kitchen: kitchen / password" -ForegroundColor Gray  
    Write-Host "      - Student: user1 / password" -ForegroundColor Gray

} catch {
    Write-Host "❌ API test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "❌ Error details: $($_.Exception)" -ForegroundColor Red
}