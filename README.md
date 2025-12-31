# Small Business Website - AWS S3/CloudFront Deployment

A cost-effective static website hosted on AWS S3 with CloudFront CDN, featuring:
- Stripe payment integration
- Contact form with AWS SES email delivery
- Affiliate links section
- Modern, responsive design

## Architecture

- **Frontend**: Static HTML/CSS/JS hosted on S3
- **CDN**: CloudFront for global distribution
- **Form Handler**: Lambda function for processing contact form submissions
- **Email**: AWS SES for sending enquiry emails
- **Payments**: Stripe for card payments (PayPal can be added)

## Cost Estimate

This setup is designed to be extremely cost-effective:
- **S3 Storage**: ~$0.023 per GB/month (first 50GB free)
- **CloudFront**: ~$0.085 per GB data transfer (first 1TB free for 12 months)
- **Lambda**: Free tier includes 1M requests/month
- **SES**: Free tier includes 62,000 emails/month (if in sandbox, 200/day)
- **Total**: Typically under $1-5/month for small traffic

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Node.js (for Lambda deployment)
4. Stripe account (for payments)
5. Domain name (optional, but recommended)

## Deployment Steps

### 1. Set Up S3 Bucket

```bash
# Create S3 bucket (replace with your bucket name)
aws s3 mb s3://your-business-website

# Enable static website hosting
aws s3 website s3://your-business-website \
    --index-document index.html \
    --error-document index.html

# Upload website files
aws s3 sync . s3://your-business-website \
    --exclude "lambda/*" \
    --exclude "*.md" \
    --exclude ".git/*" \
    --exclude "node_modules/*"

# Set bucket policy for public read access
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-business-website/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket your-business-website --policy file://bucket-policy.json
```

### 2. Set Up CloudFront Distribution

1. Go to CloudFront console
2. Create new distribution
3. Set Origin Domain to your S3 bucket endpoint
4. Set Default Root Object to `index.html`
5. Enable HTTPS (free SSL certificate via AWS Certificate Manager)
6. Set up custom domain (optional)
7. Note the CloudFront distribution URL

### 3. Configure AWS SES

```bash
# Verify your email address in SES
aws ses verify-email-identity --email-address your-email@domain.com

# If in sandbox mode, verify recipient email too
aws ses verify-email-identity --email-address contact@yourdomain.com

# Request production access if needed (for sending to any email)
```

### 4. Deploy Lambda Function

```bash
cd lambda

# Install dependencies
npm install

# Create deployment package
zip -r function.zip . -x "*.git*" "*.md"

# Create IAM role for Lambda (one-time setup)
aws iam create-role --role-name lambda-ses-role \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "lambda.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }'

# Attach SES send email policy
aws iam attach-role-policy --role-name lambda-ses-role \
    --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess

# Attach basic Lambda execution policy
aws iam attach-role-policy --role-name lambda-ses-role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Get role ARN (you'll need this)
aws iam get-role --role-name lambda-ses-role --query 'Role.Arn' --output text

# Create Lambda function
aws lambda create-function \
    --function-name ses-form-handler \
    --runtime nodejs18.x \
    --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-ses-role \
    --handler ses-form-handler.handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --memory-size 256 \
    --environment Variables="{FROM_EMAIL=your-verified-email@domain.com,TO_EMAIL=contact@yourdomain.com}"

# Create API Gateway (HTTP API - cheaper than REST API)
aws apigatewayv2 create-api \
    --name form-api \
    --protocol-type HTTP \
    --cors-configuration AllowOrigins="*",AllowMethods="POST,OPTIONS",AllowHeaders="content-type"

# Note: You'll need to set up API Gateway integration manually or use console
# The API Gateway URL will be your FORM_API_URL
```

**Alternative: Use AWS Console for API Gateway Setup**
1. Go to API Gateway console
2. Create HTTP API
3. Add Lambda integration pointing to `ses-form-handler`
4. Configure CORS
5. Deploy API
6. Copy the API endpoint URL

### 5. Update Configuration

Update `script.js` with your actual values:

```javascript
const CONFIG = {
    FORM_API_URL: 'https://your-api-id.execute-api.region.amazonaws.com/submit-form',
    STRIPE_PUBLISHABLE_KEY: 'pk_live_your_stripe_key', // or pk_test_ for testing
    PAYPAL_CLIENT_ID: 'your_paypal_client_id' // optional
};
```

### 6. Set Up Stripe

1. Create Stripe account at https://stripe.com
2. Get your publishable key from Stripe dashboard
3. Set up webhook endpoint for payment confirmation (optional)
4. For production, you'll need a backend endpoint to create payment intents

**Note**: For full Stripe integration, you'll need a backend endpoint to securely create payment intents. Consider adding another Lambda function for this.

### 7. Final Deployment

```bash
# After updating script.js with your config
aws s3 sync . s3://your-business-website \
    --exclude "lambda/*" \
    --exclude "*.md" \
    --exclude ".git/*" \
    --exclude "node_modules/*" \
    --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
```

## Security Considerations

1. **CORS**: Update CORS headers in Lambda to restrict to your domain
2. **API Keys**: Never commit API keys to version control
3. **SES**: Move out of sandbox mode for production
4. **HTTPS**: Always use HTTPS (CloudFront provides free SSL)
5. **Rate Limiting**: Consider adding rate limiting to Lambda function

## Customization

### Update Business Name
- Replace "Your Business" in `index.html`
- Update logo text in navigation

### Add Products
- Modify the product cards in `index.html`
- Update product data attributes for pricing

### Add Affiliate Links
- Update affiliate card links in `index.html`
- Add your affiliate tracking parameters

### Styling
- Modify `styles.css` to match your brand colors
- Update CSS variables in `:root` selector

## Monitoring

- **CloudWatch**: Monitor Lambda function logs
- **S3 Analytics**: Track storage and request metrics
- **CloudFront**: Monitor cache hit rates and data transfer
- **SES**: Monitor bounce and complaint rates

## Troubleshooting

### Form Not Sending
- Check Lambda function logs in CloudWatch
- Verify SES email addresses are verified
- Check API Gateway CORS configuration
- Verify Lambda has SES permissions

### Payments Not Working
- Verify Stripe publishable key is correct
- Check browser console for errors
- Ensure payment intent endpoint is set up (if using full Stripe integration)

### CloudFront Not Updating
- Create CloudFront invalidation after uploading files
- Check cache TTL settings

## Support

For issues or questions:
1. Check AWS CloudWatch logs for Lambda errors
2. Verify all environment variables are set correctly
3. Ensure IAM roles have proper permissions
4. Check SES sending limits if in sandbox mode

## License

This project is provided as-is for client use.

# Customer1
