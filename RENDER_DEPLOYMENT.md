# Deploying Light Hub Customs to Render

## Prerequisites
1. AWS Account with DynamoDB tables set up
2. AWS Cognito User Pool configured
3. Render account (free tier works)
4. GitHub repository (optional but recommended)

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Render**:
   - Go to https://dashboard.render.com
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables** in Render Dashboard:
   
   For **lighthub-orders-api**:
   - `AWS_ACCESS_KEY_ID` - Your AWS access key
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
   - `AWS_REGION` - us-east-1 (or your region)
   
   For **lighthub-ecommerce-app**:
   - `VITE_COGNITO_USER_POOL_ID` - Your Cognito User Pool ID
   - `VITE_COGNITO_CLIENT_ID` - Your Cognito App Client ID
   - `VITE_API_URL` - Will be auto-set from backend service

### Option 2: Manual Deployment

#### Deploy Backend API:
1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: lighthub-orders-api
   - **Root Directory**: orders-api
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start:dynamodb`
   - **Environment**: Node
4. Add environment variables (see above)

#### Deploy Frontend:
1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: lighthub-ecommerce-app
   - **Root Directory**: ecommerce-app
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
4. Add environment variables (see above)

## Post-Deployment

1. **Update CORS in backend**: The backend API URL will be provided by Render. Update CORS settings if needed.

2. **Update API URL in frontend**: Set `VITE_API_URL` to your backend service URL (e.g., https://lighthub-orders-api.onrender.com)

3. **Test the deployment**:
   - Visit your frontend URL
   - Try logging in
   - Place a test order

## Important Notes

- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Consider upgrading to paid tier for production use
- Keep AWS credentials secure - never commit them to git

## Troubleshooting

- Check logs in Render Dashboard for each service
- Verify environment variables are set correctly
- Ensure DynamoDB tables exist in your AWS account
- Verify Cognito configuration matches your setup
