#!/bin/bash

# Script to create a clean ZIP file for GitHub upload

echo "Creating a clean ZIP file of 2PC ALGO Trading Platform for GitHub upload..."

# Create a temporary directory
TEMP_DIR="temp_2pc_algo_github"
mkdir -p $TEMP_DIR

# Copy all necessary files, excluding node_modules, build, etc.
echo "Copying project files..."
rsync -av --progress ./ $TEMP_DIR/ \
  --exclude node_modules \
  --exclude build \
  --exclude .git \
  --exclude .DS_Store \
  --exclude "*.zip"

# Create the ZIP file
ZIP_NAME="2PC_ALGO_GitHub_$(date +%Y%m%d_%H%M%S).zip"
echo "Creating ZIP file: $ZIP_NAME..."
(cd $TEMP_DIR && zip -r "../$ZIP_NAME" .)

# Remove temporary directory
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo "Done! ZIP file created successfully."
echo "You can now upload $ZIP_NAME to GitHub by:"
echo "1. Creating a new repository on GitHub"
echo "2. Uploading this ZIP file by clicking 'Add file' > 'Upload files'"
echo "3. Extracting the contents to your local machine if you want to continue development"
echo ""
echo "Note: For continued development and better version control, using Git directly is recommended." 