#!/usr/bin/env pwsh

# Test script to check backend connectivity
Write-Host "Testing backend server connectivity..."

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/" -Method GET -TimeoutSec 5
    Write-Host "Backend server is running! Response: $($response.StatusCode)" -ForegroundColor Green
    
    # Test signup endpoint
    Write-Host "Testing signup endpoint..."
    $signupData = @{
        username = "test" + (Get-Date).Ticks
        email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"  
        password = "testpassword123"
        roll_number = "23101A0010"
        role = "user"
    } | ConvertTo-Json
    
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/signup" -Method POST -Body $signupData -ContentType "application/json" -TimeoutSec 10
    Write-Host "Signup successful! Response: $($signupResponse | ConvertTo-Json)" -ForegroundColor Green
    
} catch {
    Write-Host "Error connecting to backend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please ensure the backend server is running on http://localhost:4000" -ForegroundColor Yellow
}