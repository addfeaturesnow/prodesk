# Deploy Frontend to AWS Amplify

## Prerequisites
- Frontend built: `npm run build` ✅ (creates `dist/` folder)
- Railway backend deployed with public URL ✅
- AWS account (free tier available)

## Step 1: Connect GitHub to Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"Create app"** → **"Host web app"**
3. Select **GitHub** as your repository service
4. Click **"Authorize AWS Amplify"**
5. Select `prodiving` organization and `prodesk` repository
6. Select **`main`** branch

## Step 2: Configure Build Settings

1. **Choose build image**: Default (`ubuntu:amazonlinux:2`)
2. Click **"Edit"** on build settings and set:
   ```yaml
   version: 1
   frontend:
     phases:
       build:
         commands:
           - npm ci
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   env:
     variables:
       VITE_API_URL: https://prodesk-api-xxxx.railway.app
   ```

3. Replace `https://prodesk-api-xxxx.railway.app` with your actual Railway URL

## Step 3: Set Build Environment Variables

In the Amplify console:
1. Go to **"App settings"** → **"Environment variables"**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://prodesk-api-xxxx.railway.app` (your Railway backend URL)

## Step 4: Deploy

1. Click **"Save and deploy"**
2. Amplify will automatically:
   - Pull from GitHub
   - Run `npm run build` with your env vars
   - Deploy the `dist/` folder to CloudFront CDN

3. Wait for the deployment to complete (3-5 minutes)
4. You'll get a public URL: `https://main-xxxx.amplifyapp.com`

## Step 5: Verify Frontend

1. Open your Amplify URL in a browser
2. You should see the POS System UI
3. Check the browser console (F12) - no 404 errors for API calls
4. Try logging in - API should respond from your Railway backend

## Troubleshooting

**Frontend loads but API calls fail?**
- Check browser Network tab → API requests
- Verify `VITE_API_URL` matches your Railway URL exactly
- Check Railway backend logs for errors

**Build fails?**
- Check Amplify build logs
- Ensure `npm run build` works locally: `npm run build`
- Verify no syntax errors: `npm run lint`

---

## Next Steps

Once both are deployed:
1. Test the full flow: frontend → API → Neon database
2. Run smoke tests against the production URLs
3. Monitor Railway and Amplify logs for errors
