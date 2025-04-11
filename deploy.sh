#!/bin/bash

# 2PC ALGO Deployment Script
echo "🚀 Starting 2PC ALGO deployment process..."

# Build the application
echo "📦 Building the application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi

echo "✅ Build successful!"

# Deploying options
echo ""
echo "Please choose a deployment method:"
echo "1) Deploy to Netlify (requires Netlify CLI)"
echo "2) Create a deployment package for manual upload"
echo ""
read -p "Enter your choice (1-2): " choice

case $choice in
  1)
    # Netlify deployment
    echo "🔄 Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
      echo "❌ Netlify CLI not found. Would you like to install it now? (y/n)"
      read -p "> " install_netlify
      
      if [ "$install_netlify" = "y" ]; then
        npm install -g netlify-cli
      else
        echo "❌ Netlify CLI is required for this deployment method."
        exit 1
      fi
    fi
    
    # Check if user is logged in to Netlify
    netlify status
    if [ $? -ne 0 ]; then
      echo "🔐 Please login to Netlify:"
      netlify login
    fi
    
    # Deploy to Netlify
    echo "🌐 Deploying to 2pcalgo.com via Netlify..."
    netlify deploy --prod
    
    if [ $? -eq 0 ]; then
      echo "✅ Deployment successful! Your site is now live at https://www.2pcalgo.com/"
    else
      echo "❌ Deployment failed. Please check the errors above."
      exit 1
    fi
    ;;
    
  2)
    # Create deployment package
    echo "📦 Creating deployment package..."
    
    # Create a zip file of the build directory
    zip_file="2pcalgo-deploy-$(date +%Y%m%d-%H%M%S).zip"
    zip -r "$zip_file" build/
    
    if [ $? -eq 0 ]; then
      echo "✅ Deployment package created: $zip_file"
      echo ""
      echo "MANUAL DEPLOYMENT INSTRUCTIONS:"
      echo "1. Upload the contents of the 'build' folder to your web hosting root directory"
      echo "2. Ensure your hosting is configured to handle a React single-page application"
      echo "3. Any 404 errors should redirect to index.html to support client-side routing"
      echo ""
      echo "If you're using cPanel or similar hosting:"
      echo "- Upload the zip file to your web hosting"
      echo "- Extract it on the server"
      echo "- Move all files to the public_html directory or your preferred location"
    else
      echo "❌ Failed to create deployment package."
      exit 1
    fi
    ;;
    
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "🎉 Thank you for using 2PC ALGO!" 