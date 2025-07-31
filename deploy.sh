#!/bin/bash

# =================================================================
#  All-in-One Deploy Script for Ankit's Portfolio
# =================================================================
#
# This script automates the full deployment workflow:
# 1. Commits and pushes local changes to GitHub.
# 2. Connects to the GCE server via SSH.
# 3. Pulls the latest changes and restarts the web server.
#
# Instructions:
# 1. Place this script in the root of your local portfolio project.
# 2. Update the configuration variables below.
# 3. Make the script executable: chmod +x deploy.sh
# 4. Run it from your terminal: ./deploy.sh
#

# --- Configuration ---
# !!! IMPORTANT: REPLACE THESE WITH YOUR VM DETAILS !!!
GCE_USER="your_gce_username"       # e.g., ankit_anjul or your linux username
GCE_HOST="your_gce_external_ip"  # The external IP address of your VM
PROJECT_DIR="/var/www/Portfolio"
SERVICE_NAME="nginx"
GIT_BRANCH="main" # Or "master" if that's your primary branch


# --- Script Logic ---

# 1. PUSH TO GITHUB
echo "➡️  STEP 1: Committing and pushing local changes..."

# Ask for a commit message
read -p "Enter a commit message: " COMMIT_MESSAGE

# If the commit message is empty, use a default one
if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="Deploying updates - $(date)"
fi

# Add, commit, and push
git add .
git commit -m "$COMMIT_MESSAGE"
git push origin ${GIT_BRANCH} || { echo "❌ Git push failed!"; exit 1; }

echo "✅ Local changes pushed successfully."
echo "----------------------------------------"
echo "🚀 STEP 2: Starting deployment to GCE..."

# 2. DEPLOY TO SERVER
# Connect to the server and run the deployment steps
ssh ${GCE_USER}@${GCE_HOST} "
    echo '➡️  Navigating to app directory...'
    cd ${PROJECT_DIR} || { echo '❌ App directory not found on server!'; exit 1; }

    echo '🔄  Pulling latest changes from Git...'
    sudo git pull origin ${GIT_BRANCH} || { echo '❌ Git pull failed on server!'; exit 1; }

    echo '♻️  Restarting Nginx service...'
    sudo systemctl restart ${SERVICE_NAME}

    echo '✅  Checking service status...'
    sudo systemctl status ${SERVICE_NAME} --no-pager
"

echo "----------------------------------------"
echo "✨ Deployment script finished."

