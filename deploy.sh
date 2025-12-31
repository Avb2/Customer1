#!/bin/bash

# AWS S3 Static Website Deployment Script
# Extremely cheap temporary deployment for customer review

set -e

# Configuration - UPDATE THESE VALUES
BUCKET_NAME="allied-strategic-ops-$(date +%s)"  # Unique bucket name with timestamp
REGION="us-east-1"  # Change to your preferred region
PROFILE=""  # Leave empty to use default AWS profile, or set to your profile name

echo "🚀 Deploying Allied Strategic Operations website to AWS S3"
echo "Bucket name: $BUCKET_NAME"
echo "Region: $REGION"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if [ -n "$PROFILE" ]; then
    AWS_PROFILE_ARG="--profile $PROFILE"
else
    AWS_PROFILE_ARG=""
fi

echo "Checking AWS credentials..."
if ! aws sts get-caller-identity $AWS_PROFILE_ARG &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials found"
echo ""

# Create S3 bucket
echo "Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME --region $REGION $AWS_PROFILE_ARG

# Enable static website hosting
echo "Enabling static website hosting..."
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html \
    $AWS_PROFILE_ARG

# Disable Block Public Access (required for static website hosting)
echo "Configuring public access settings..."
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    $AWS_PROFILE_ARG

# Set bucket policy for public read access
echo "Setting bucket policy for public access..."
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json $AWS_PROFILE_ARG

# Upload files
echo "Uploading website files..."
aws s3 sync . s3://$BUCKET_NAME \
    --exclude "*.sh" \
    --exclude "*.md" \
    --exclude ".git/*" \
    --exclude ".gitignore" \
    --exclude "deploy.sh" \
    --exclude "cleanup.sh" \
    --exclude "README-DEPLOYMENT.md" \
    --exclude "node_modules/*" \
    --exclude ".DS_Store" \
    --delete \
    $AWS_PROFILE_ARG

# Set content types for HTML files
echo "Setting correct content types..."
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
    --content-type "text/html" \
    --metadata-directive REPLACE \
    $AWS_PROFILE_ARG

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Website URL: $WEBSITE_URL"
echo ""
echo "📝 IMPORTANT: Save this information for cleanup:"
echo "   Bucket name: $BUCKET_NAME"
echo "   Region: $REGION"
echo ""
echo "To delete this deployment, run:"
echo "   ./cleanup.sh $BUCKET_NAME $REGION"
echo ""
echo "Or manually delete the bucket:"
echo "   aws s3 rb s3://$BUCKET_NAME --force $AWS_PROFILE_ARG"
echo ""

# Save deployment info
echo "$BUCKET_NAME|$REGION|$WEBSITE_URL" > .deployment-info
