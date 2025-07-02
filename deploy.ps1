# Professional Email Sender - PowerShell Deployment Script
# This script sets up and deploys the application to Render

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (-not (Test-Path "package.json") -or -not (Test-Path "render.yaml")) {
    Write-Error "This script must be run from the project root directory"
    exit 1
}

# Check Git status
Write-Status "Checking Git status..."
try {
    git rev-parse --git-dir | Out-Null
} catch {
    Write-Error "Not a git repository. Please initialize git first."
    exit 1
}

# Ensure we're on main branch
Write-Status "Switching to main branch..."
git checkout -B main

# Add remote if not exists
try {
    git remote get-url origin | Out-Null
} catch {
    Write-Status "Adding GitHub remote..."
    git remote add origin https://github.com/IrisGuard/personalized-email-sender.git
}

# Fetch from remote
Write-Status "Fetching from remote..."
try {
    git fetch origin main 2>$null
} catch {
    # Ignore errors on first fetch
}

# Install dependencies
Write-Status "Installing frontend dependencies..."
npm install

Write-Status "Installing backend dependencies..."
Set-Location server
npm install
Set-Location ..

# Build the application
Write-Status "Building application..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Please check the error messages above."
    exit 1
}

# Commit all changes
Write-Status "Committing changes..."
git add .
$commitResult = git commit -m "Production deployment ready - $(Get-Date)"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "No changes to commit"
}

# Push to GitHub
Write-Status "Pushing to GitHub..."
git push origin main --force-with-lease

# Trigger Render deployment
Write-Status "Triggering Render deployment..."
try {
    $response = Invoke-WebRequest -Uri "https://api.render.com/deploy/srv-d1f6rtvgi27c73cfkvt0?key=sviLo3YSBS8" -Method POST -ContentType "application/json"
    
    if ($response.StatusCode -eq 200) {
        Write-Status "✅ Deployment triggered successfully!"
        Write-Host ""
        Write-Host "🌐 Your application will be available at:" -ForegroundColor Cyan
        Write-Host "   https://personalized-email-sender.onrender.com" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Monitor deployment progress at:" -ForegroundColor Cyan
        Write-Host "   https://dashboard.render.com" -ForegroundColor White
        Write-Host ""
        Write-Host "🔧 Environment variables needed in Render Dashboard:" -ForegroundColor Cyan
        Write-Host "   - NODE_ENV=production" -ForegroundColor White
        Write-Host "   - GMAIL_USER=[your_gmail@gmail.com]" -ForegroundColor White
        Write-Host "   - GMAIL_APP_PASSWORD=[your_app_password]" -ForegroundColor White
        Write-Host "   - COMPANY_NAME=AKROGONOS INTERNATIONAL GROUP" -ForegroundColor White
        Write-Host "   - COMPANY_REPLY_TO=[your_reply@gmail.com]" -ForegroundColor White
    } else {
        Write-Error "Deployment request failed with status code: $($response.StatusCode)"
        exit 1
    }
} catch {
    Write-Error "Failed to trigger deployment. Please check your internet connection and try again."
    Write-Error $_.Exception.Message
    exit 1
}

Write-Status "🎉 Deployment process completed!" 