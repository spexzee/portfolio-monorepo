#!/bin/bash

# Check if there are changes in the portfolio-management-server app
# Used by Vercel to determine if a build should proceed

echo "Checking for changes in portfolio-management-server..."

# Check for changes in the specific app directory and shared packages
git diff HEAD^ HEAD --quiet -- apps/portfolio-management-server/ packages/

# Exit with 1 if there are changes (proceed with build)
# Exit with 0 if there are no changes (skip build)
if [ $? -eq 0 ]; then
  echo "No changes detected in portfolio-management-server. Skipping build."
  exit 0
else
  echo "Changes detected in portfolio-management-server. Proceeding with build."
  exit 1
fi
