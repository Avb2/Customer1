#!/bin/bash

# Cleanup script for AWS S3 deployment
# Usage: ./cleanup.sh [bucket-name] [region]

set -e

if [ -f .deployment-info ]; then
    DEPLOYMENT_INFO=$(cat .deployment-info)
    BUCKET_NAME=$(echo $DEPLOYMENT_INFO | cut -d'|' -f1)
    REGION=$(echo $DEPLOYMENT_INFO | cut -d'|' -f2)
    DISTRIBUTION_ID=$(echo $DEPLOYMENT_INFO | cut -d'|' -f4)
else
    if [ -z "$1" ]; then
        echo "❌ No deployment info found. Please provide bucket name:"
        echo "   Usage: ./cleanup.sh [bucket-name] [region] [distribution-id]"
        exit 1
    fi
    BUCKET_NAME=$1
    REGION=${2:-us-east-1}
    DISTRIBUTION_ID=$3
fi

PROFILE=""  # Leave empty or set to your AWS profile

if [ -n "$PROFILE" ]; then
    AWS_PROFILE_ARG="--profile $PROFILE"
else
    AWS_PROFILE_ARG=""
fi

echo "🗑️  Cleaning up AWS deployment"
echo "Bucket: $BUCKET_NAME"
echo "Region: $REGION"
if [ -n "$DISTRIBUTION_ID" ]; then
    echo "CloudFront Distribution: $DISTRIBUTION_ID"
fi
echo ""
read -p "Are you sure you want to delete this deployment? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

# Delete CloudFront distribution if it exists
if [ -n "$DISTRIBUTION_ID" ]; then
    echo "Disabling CloudFront distribution..."
    # Get current config and ETag
    DIST_CONFIG=$(aws cloudfront get-distribution-config --id $DISTRIBUTION_ID $AWS_PROFILE_ARG)
    ETAG=$(echo $DIST_CONFIG | jq -r '.ETag')
    CONFIG=$(echo $DIST_CONFIG | jq -r '.DistributionConfig')
    
    # Disable the distribution
    echo $CONFIG | jq '.Enabled = false' > /tmp/cloudfront-disable.json
    aws cloudfront update-distribution --id $DISTRIBUTION_ID --if-match $ETAG --distribution-config file:///tmp/cloudfront-disable.json $AWS_PROFILE_ARG > /dev/null
    
    echo "Waiting for CloudFront distribution to be disabled (this may take 10-15 minutes)..."
    aws cloudfront wait distribution-deployed --id $DISTRIBUTION_ID $AWS_PROFILE_ARG
    
    echo "Deleting CloudFront distribution..."
    DIST_CONFIG=$(aws cloudfront get-distribution-config --id $DISTRIBUTION_ID $AWS_PROFILE_ARG)
    ETAG=$(echo $DIST_CONFIG | jq -r '.ETag')
    aws cloudfront delete-distribution --id $DISTRIBUTION_ID --if-match $ETAG $AWS_PROFILE_ARG
fi

echo "Deleting S3 bucket and all contents..."
aws s3 rb s3://$BUCKET_NAME --force $AWS_PROFILE_ARG

# Remove deployment info
if [ -f .deployment-info ]; then
    rm .deployment-info
fi

echo ""
echo "✅ Cleanup complete! Bucket $BUCKET_NAME has been deleted."

