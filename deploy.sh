#!/bin/bash

# Professional Email Sender - Deployment Script
# This script sets up and deploys the application to Render

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "render.yaml" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check Git status
print_status "Checking Git status..."
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository. Please initialize git first."
    exit 1
fi

# Ensure we're on main branch
print_status "Switching to main branch..."
git checkout -B main

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_status "Adding GitHub remote..."
    git remote add origin https://github.com/IrisGuard/personalized-email-sender.git
fi

# Fetch from remote
print_status "Fetching from remote..."
git fetch origin main 2>/dev/null || true

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

print_status "Installing backend dependencies..."
cd server && npm install && cd ..

# Build the application
print_status "Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the error messages above."
    exit 1
fi

# Commit all changes
print_status "Committing changes..."
git add .
git commit -m "Production deployment ready - $(date)" || print_warning "No changes to commit"

# Push to GitHub
print_status "Pushing to GitHub..."
git push origin main --force-with-lease

# Trigger Render deployment
print_status "Triggering Render deployment..."
curl -X POST "https://api.render.com/deploy/srv-d1f6rtvgi27c73cfkvt0?key=sviLo3YSBS8"

if [ $? -eq 0 ]; then
    print_status "✅ Deployment triggered successfully!"
    echo ""
    echo "🌐 Your application will be available at:"
    echo "   https://personalized-email-sender.onrender.com"
    echo ""
    echo "📊 Monitor deployment progress at:"
    echo "   https://dashboard.render.com"
    echo ""
    echo "🔧 Environment variables needed in Render Dashboard:"
    echo "   - NODE_ENV=production"
    echo "   - GMAIL_USER=[your_gmail@gmail.com]"
    echo "   - GMAIL_APP_PASSWORD=[your_app_password]"
    echo "   - COMPANY_NAME=AKROGONOS INTERNATIONAL GROUP"
    echo "   - COMPANY_REPLY_TO=[your_reply@gmail.com]"
else
    print_error "Failed to trigger deployment. Please check your internet connection and try again."
    exit 1
fi

print_status "🎉 Deployment process completed!" 