# Deploy Backend to Railway with Neon Database

## Prerequisites
- Neon database created ✅ (you have the connection string)
- GitHub account connected to Railway
- Repository pushed to GitHub

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Create a new project"**
3. Select **"Deploy from GitHub repo"**
4. **Authorize** Railway to access your GitHub account
5. Select the **`prodiving/prodesk`** repository

## Step 2: Configure the Deployment

1. **Set the root directory** to `server/` (important - only deploy the backend)
2. **Add environment variable**:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://neondb_owner:npg_oYR5GfMuO7Bn@ep-raspy-lake-aisuimz9-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
3. **Set the start command** (if needed):
   - `npm run start` (this runs migrations + starts the server)

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, Railway will give you a **public URL** like:
   ```
   https://prodesk-api-xxx.railway.app
   ```
   Copy this URL - you'll need it for the frontend deployment.

## Step 4: Verify Deployment

Test your API with the public URL:

```bash
curl https://prodesk-api-xxx.railway.app/health
```

Should return:
```json
{"ok":true}
```

## Step 5: Deploy Frontend to Amplify

Once you have the Railway URL, follow [AMPLIFY_DEPLOY.md](AMPLIFY_DEPLOY.md) and set:
- **Build env var**: `VITE_API_URL=https://prodesk-api-xxx.railway.app`

This tells your frontend where to find the API.
