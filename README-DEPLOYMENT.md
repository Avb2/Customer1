# AWS S3 Static Website Deployment

This is an **extremely cheap** temporary deployment solution for sharing the website with your customer. Estimated cost: **$0.00-0.50/month** for typical usage.

## Prerequisites

1. **AWS Account** (free tier is fine)
2. **AWS CLI installed** - [Installation Guide](https://aws.amazon.com/cli/)
3. **AWS credentials configured** - Run `aws configure`

## Quick Start

### 1. Configure AWS Credentials

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format (just press Enter for `json`)

### 2. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Create a unique S3 bucket
- Enable static website hosting
- Upload all website files
- Provide you with the website URL

### 3. Share the URL

The script will output a URL like:
```
http://allied-strategic-ops-1234567890.s3-website-us-east-1.amazonaws.com
```

Share this URL with your customer.

## Cost Breakdown

**S3 Storage**: ~$0.023 per GB/month (your site is probably < 1GB = ~$0.02/month)
**Data Transfer Out**: First 1GB free, then $0.09/GB (typical review = minimal cost)
**Requests**: $0.0004 per 1,000 GET requests (negligible)

**Total estimated cost for temporary deployment: $0.00 - $0.50/month**

## Cleanup

When you're done, delete the deployment:

```bash
chmod +x cleanup.sh
./cleanup.sh
```

Or manually:
```bash
# Get bucket name from .deployment-info or from AWS console
aws s3 rb s3://YOUR-BUCKET-NAME --force
```

## Troubleshooting

### "Access Denied" error
- Make sure the bucket policy was applied correctly
- Check that public access block settings allow public read

### Files not updating
- The script uses `--delete` flag, so it should sync properly
- Try running the deploy script again

### Region issues
- Edit `deploy.sh` and change `REGION="us-east-1"` to your preferred region
- Common regions: `us-east-1`, `us-west-2`, `eu-west-1`

## Alternative: CloudFront (Optional)

If you want better performance and a custom domain, you can add CloudFront:

1. After S3 deployment, create a CloudFront distribution
2. Point it to your S3 bucket website endpoint
3. This adds ~$0.085/GB for data transfer (still very cheap)

**Note**: CloudFront adds complexity and slightly more cost. For a simple temporary review, S3 static hosting is sufficient.

## Security Notes

- This setup makes the bucket publicly readable (required for static hosting)
- Only use for temporary customer review
- Delete the bucket when done
- Don't store sensitive data in the bucket

## Support

If you encounter issues:
1. Check AWS CLI is installed: `aws --version`
2. Verify credentials: `aws sts get-caller-identity`
3. Check bucket exists: `aws s3 ls`

