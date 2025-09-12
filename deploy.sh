#!/bin/bash

# FreshCart E-Commerce Deployment Script
echo "🚀 Starting FreshCart E-Commerce deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf .angular/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm run test -- --watch=false --browsers=ChromeHeadless

# Build for production
echo "🏗️ Building for production..."
ng build --configuration=production

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in the 'dist' directory"
    echo "🌐 Ready for deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Deployment preparation complete!"
