#!/bin/bash

# ================================
#  Ankit's Portfolio Deploy Script
# ================================

# Configuration
GCE_USER="ankit_anjul"
GCE_HOST="34.93.194.88"
PROJECT_DIR="/var/www/Portfolio"
SERVICE_NAME="nginx"
GIT_BRANCH="main"

# Step 1: Push to GitHub
echo "➡️  Committing and pushing local changes..."
git add .
git commit -m "Automated deployment - $(date)"
git push origin ${GIT_BRANCH} || { echo "❌ Git push failed!"; exit 1; }
echo "✅ Code pushed to GitHub."

# Step 2: Deploy on GCE
echo "🚀 Starting deployment on GCE server..."
ssh ${GCE_USER}@${GCE_HOST} "
    echo '➡️  Navigating to project directory...'
    cd ${PROJECT_DIR} || { echo '❌ Directory not found!'; exit 1; }

    echo '🔄 Pulling latest changes...'
    sudo git pull origin ${GIT_BRANCH} || { echo '❌ Git pull failed!'; exit 1; }

    echo '♻️ Restarting ${SERVICE_NAME}...'
    sudo systemctl restart ${SERVICE_NAME}
    sudo systemctl status ${SERVICE_NAME} --no-pager
"

echo "✅ Deployment completed successfully."
