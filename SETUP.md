# Quick Setup Guide

## Step-by-Step Setup

### 1. AWS S3 Setup (5 minutes)

```bash
# Create bucket
aws s3 mb s3://your-business-website

# Enable static website hosting
aws s3 website s3://your-business-website --index-document index.html

# Upload files
./deploy.sh your-business-website
```

### 2. CloudFront Setup (10 minutes)

1. Go to AWS Console → CloudFront
2. Click "Create Distribution"
3. Origin Domain: Select your S3 bucket
4. Viewer Protocol Policy: Redirect HTTP to HTTPS
5. Default Root Object: `index.html`
6. Click "Create Distribution"
7. Wait 5-10 minutes for deployment
8. Copy the CloudFront URL (e.g., `d1234abcd.cloudfront.net`)

### 3. AWS SES Setup (10 minutes)

1. Go to AWS Console → SES
2. Verify your email address (the one you'll send FROM)
3. Verify recipient email (the one you'll send TO)
4. If in sandbox mode, you can only send to verified emails
5. To send to any email, request production access (takes 24-48 hours)

### 4. Lambda Function Setup (15 minutes)

```bash
cd lambda
npm install
zip -r function.zip . -x "*.git*" "*.md"

# Create function (replace YOUR_ACCOUNT_ID and email addresses)
aws lambda create-function \
    --function-name ses-form-handler \
    --runtime nodejs18.x \
    --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-ses-role \
    --handler ses-form-handler.handler \
    --zip-file fileb://function.zip \
    --timeout 30 \
    --environment Variables="{FROM_EMAIL=noreply@yourdomain.com,TO_EMAIL=contact@yourdomain.com}"
```

**Create IAM Role First:**
1. Go to IAM Console → Roles → Create Role
2. Select "Lambda"
3. Attach policies:
   - `AWSLambdaBasicExecutionRole`
   - `AmazonSESFullAccess` (or create custom policy with only SendEmail permission)
4. Name it `lambda-ses-role`
5. Note the ARN

### 5. API Gateway Setup (10 minutes)

**Option A: Using Console (Easiest)**
1. Go to API Gateway → Create API → HTTP API
2. Add integration → Lambda → Select `ses-form-handler`
3. Configure route: POST /submit-form
4. Configure CORS:
   - Allow origins: `*` (or your domain)
   - Allow methods: `POST, OPTIONS`
   - Allow headers: `content-type`
5. Deploy → Create stage → `prod`
6. Copy the API endpoint URL

**Option B: Using CLI**
```bash
# Create API
aws apigatewayv2 create-api --name form-api --protocol-type HTTP

# Add Lambda integration (you'll need the API ID and Lambda ARN)
# This is complex - use console for easier setup
```

### 6. Update Configuration

Edit `script.js` and update:

```javascript
const CONFIG = {
    FORM_API_URL: 'https://YOUR_API_ID.execute-api.REGION.amazonaws.com/submit-form',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_KEY',
    PAYPAL_CLIENT_ID: 'your_paypal_id' // optional
};
```

### 7. Stripe Setup (5 minutes)

1. Sign up at https://stripe.com
2. Get your publishable key from Dashboard → Developers → API keys
3. Use test keys for development (`pk_test_...`)
4. Use live keys for production (`pk_live_...`)

**Note**: Full payment processing requires a backend to create payment intents securely. The current setup shows the UI, but you'll need to add a Lambda function to handle payment intent creation.

### 8. Final Deployment

```bash
# Update script.js with your config first
./deploy.sh your-business-website YOUR_CLOUDFRONT_DIST_ID
```

## Testing

1. **Test Form**: Submit the contact form and check your email
2. **Test Payments**: Use Stripe test card: `4242 4242 4242 4242`
3. **Test Affiliate Links**: Click affiliate links to verify they work

## Common Issues

### "Email not verified" error
- Make sure both FROM and TO emails are verified in SES
- Check Lambda environment variables

### CORS errors
- Verify API Gateway CORS is configured
- Check Lambda response headers

### Form not submitting
- Check browser console for errors
- Check CloudWatch logs for Lambda function
- Verify API Gateway endpoint URL is correct

### CloudFront showing old content
- Create invalidation: `aws cloudfront create-invalidation --distribution-id ID --paths "/*"`
- Wait 2-5 minutes for propagation

## Cost Optimization Tips

1. **S3**: Enable lifecycle policies to move old files to cheaper storage
2. **CloudFront**: Set appropriate cache TTLs to reduce origin requests
3. **Lambda**: Use provisioned concurrency only if needed
4. **SES**: Stay in sandbox if only sending to verified emails (free)

## Next Steps

- Add custom domain to CloudFront
- Set up SSL certificate via ACM
- Add analytics (Google Analytics, CloudWatch)
- Implement rate limiting for form submissions
- Add payment intent creation Lambda function for full Stripe integration

