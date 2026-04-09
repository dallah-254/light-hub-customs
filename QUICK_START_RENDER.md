# Quick Start: Deploy to Render

## What's Been Prepared

✅ `render.yaml` - Infrastructure as code for Render
✅ API URLs updated to use environment variables
✅ AWS config updated to use environment variables
✅ `.gitignore` created
✅ `.env.example` files created

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Create GitHub repository and push
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Render

1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**

### 3. Configure Environment Variables

#### For Backend (lighthub-orders-api):
Go to the service settings and add:
- `AWS_ACCESS_KEY_ID` = Your AWS access key
- `AWS_SECRET_ACCESS_KEY` = Your AWS secret key
- `AWS_REGION` = us-east-1

#### For Frontend (lighthub-ecommerce-app):
Go to the service settings and add:
- `VITE_API_URL` = Your backend URL (e.g., https://lighthub-orders-api.onrender.com)
- `VITE_AWS_REGION` = us-east-1
- `VITE_AWS_ACCESS_KEY_ID` = Your AWS access key
- `VITE_AWS_SECRET_ACCESS_KEY` = Your AWS secret key
- `VITE_COGNITO_USER_POOL_ID` = us-east-1_x0Dl3nX6Z
- `VITE_COGNITO_CLIENT_ID` = 3l5bo817jisa8on8cs156fropk
- `VITE_DYNAMODB_TABLE_NAME` = LH-Products

### 4. Trigger Redeploy

After setting environment variables:
1. Go to each service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### 5. Test Your Deployment

1. Visit your frontend URL (provided by Render)
2. Try logging in
3. Browse products
4. Place a test order

## Important Notes

- **Free Tier Limitations**: Services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleep takes 30-60 seconds
- **Database**: Ensure your DynamoDB tables exist in AWS
- **CORS**: Backend automatically allows all origins with `cors()`

## Troubleshooting

### Backend Issues
```bash
# Check logs in Render Dashboard
# Verify AWS credentials are correct
# Ensure DynamoDB tables exist
```

### Frontend Issues
```bash
# Verify VITE_API_URL points to backend
# Check browser console for errors
# Ensure Cognito config is correct
```

### Common Errors

1. **"Failed to fetch"** - Check VITE_API_URL is set correctly
2. **"Access Denied"** - Verify AWS credentials
3. **"Table not found"** - Create DynamoDB tables in AWS

## Next Steps

- Set up custom domain (optional)
- Configure SSL certificate (automatic on Render)
- Set up monitoring and alerts
- Consider upgrading to paid tier for production

## Support

- Render Docs: https://render.com/docs
- AWS DynamoDB: https://docs.aws.amazon.com/dynamodb/
- AWS Cognito: https://docs.aws.amazon.com/cognito/
