#!/usr/bin/env pwsh

# Complete system test script
Write-Host "=== CANTEEN SYSTEM DIAGNOSTIC TEST ===" -ForegroundColor Cyan

# Test 1: Backend connectivity
Write-Host "`n1. Testing backend connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend server is running! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend server error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Database connectivity
Write-Host "`n2. Checking database orders..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "root"
    $dbResult = psql -U postgres -d canteen_db -t -c "SELECT COUNT(*) FROM orders;"
    Write-Host "✅ Database connection OK. Total orders: $($dbResult.Trim())" -ForegroundColor Green
} catch {
    Write-Host "❌ Database error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Kitchen user login
Write-Host "`n3. Testing kitchen user login..." -ForegroundColor Yellow
try {
    $loginData = @{
        identifier = "kitchen"
        password = "password"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    $kitchenToken = $loginResponse.token
    Write-Host "✅ Kitchen login successful! User: $($loginResponse.user.username)" -ForegroundColor Green
    
    # Test 4: Kitchen orders API
    Write-Host "`n4. Testing kitchen orders API..." -ForegroundColor Yellow
    $ordersResponse = Invoke-RestMethod -Uri "http://localhost:4000/kitchen/orders" -Method GET -Headers @{"Authorization"="Bearer $kitchenToken"} -TimeoutSec 10
    Write-Host "✅ Kitchen orders API working! Found $($ordersResponse.Count) orders" -ForegroundColor Green
    
    if ($ordersResponse.Count -gt 0) {
        Write-Host "Orders details:" -ForegroundColor Cyan
        $ordersResponse | ForEach-Object {
            Write-Host "  - Order #$($_.id): ₹$($_.total_amount) ($($_.status))" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "❌ Kitchen API error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: User login and order creation
Write-Host "`n5. Testing user login and order creation..." -ForegroundColor Yellow
try {
    $userLoginData = @{
        identifier = "user1"
        password = "password"
    } | ConvertTo-Json
    
    $userLoginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" -Method POST -Body $userLoginData -ContentType "application/json" -TimeoutSec 10
    $userToken = $userLoginResponse.token
    Write-Host "✅ User login successful! User: $($userLoginResponse.user.username)" -ForegroundColor Green
    
    # Create test order
    $testOrderData = @{
        items = @(
            @{
                menu_item_id = 1
                quantity = 2
            },
            @{
                menu_item_id = 3  
                quantity = 1
            }
        )
    } | ConvertTo-Json -Depth 3
    
    $orderResponse = Invoke-RestMethod -Uri "http://localhost:4000/orders" -Method POST -Body $testOrderData -ContentType "application/json" -Headers @{"Authorization"="Bearer $userToken"} -TimeoutSec 10
    Write-Host "✅ Test order created successfully! Order ID: $($orderResponse.order.id)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ User order creation error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
Write-Host "If all tests passed, the system should work properly!" -ForegroundColor Green