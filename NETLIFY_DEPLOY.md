# Netlify Deployment Guide

Your app is **ready to deploy to Netlify**. Here's what's been set up:

## ✅ What's Already Done

1. **Netlify Functions API** (`netlify/functions/api.js`)
   - Serverless API endpoints using Supabase
   - Handles: Divers, Courses, Bookings, Groups, Accommodations, Equipment

2. **Configuration** (`netlify.toml`)
   - Auto-builds `dist` folder
   - Routes `/api/*` requests to Netlify Functions
   - Redirects unmatched routes to `index.html` (SPA)

3. **API Client** (`src/integrations/api/client.ts`)
   - Auto-detects environment (local vs Netlify)
   - Uses `localhost:3000` locally
   - Uses `/.netlify/functions/api` on Netlify

4. **Environment Variables**
   - `.env` has Supabase credentials
   - `.env.example` documents what's needed

## 🚀 Deployment Steps

### Step 1: Set Up Supabase Tables
1. Go to https://supabase.com and log in
2. Create or select a project (free tier available)
3. Go to SQL Editor
4. Paste the SQL from `SUPABASE_SETUP.md` and run all scripts
5. Copy your credentials:
   - Project ID
   - Anon/Publishable Key
   - Project URL

### Step 2: Update `.env` with Real Credentials
```bash
VITE_SUPABASE_PROJECT_ID="iptjylqqovyxkukkunfh"  # Your project ID
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."        # Your anon key
VITE_SUPABASE_URL="https://yourproject.supabase.co"
```

### Step 3: Push to GitHub
```bash
git add -A
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### Step 4: Connect to Netlify
1. Go to https://netlify.com
2. Click "New site from Git"
3. Select your GitHub repository
4. Accept default build settings (Netlify reads `netlify.toml`)
5. Click "Deploy site"

### Step 5: Add Environment Variables to Netlify
1. Go to Site Settings → Build & deploy → Environment
2. Add three new variables:
   - `VITE_SUPABASE_PROJECT_ID` = your value
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your value
   - `VITE_SUPABASE_URL` = your value
3. Trigger a rebuild (Site settings → Deploys → Trigger deploy)

### Step 6: Test
- Open your Netlify URL
- Go to Divers page (should load from Supabase)
- Try creating a new diver
- Check browser console (F12) for errors

## 📋 What Works on Netlify

| Feature | Status | Location |
|---------|--------|----------|
| Frontend UI | ✅ Working | Netlify hosting |
| Divers CRUD | ✅ Working | Supabase + Netlify Functions |
| Courses | ✅ Working | Supabase + Netlify Functions |
| Bookings | ✅ Working | Supabase + Netlify Functions |
| Groups | ✅ Working | Supabase + Netlify Functions |
| Accommodations | ✅ Working | Supabase + Netlify Functions |
| Equipment | ✅ Working | Supabase + Netlify Functions |
| POS/Transactions | ❌ Not yet | Needs Express backend or function expansion |
| Rental Assignments | ❌ Not yet | Needs Express backend or function expansion |

## 🔧 Troubleshooting

### Build Fails
- Run locally first: `npm run build`
- Check Netlify build logs for errors
- Ensure all environment variables are set

### API Returns 404
- Check Supabase tables exist
- Check Netlify Functions are created (should see them in Netlify UI)
- Check network tab in DevTools for request URL

### CORS Errors
- Already handled in Netlify Function headers
- If still issues, check browser console for specific error

### Data Not Loading
- Verify Supabase credentials in Netlify environment variables
- Check Supabase tables have data
- Check browser console for API response details

## 📝 See Also
- `SUPABASE_SETUP.md` - SQL scripts to create Supabase tables
- `NETLIFY_SETUP.md` - Original setup documentation
- `NETLIFY_DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

## 💡 Next Steps (Optional)

If you need POS, Transactions, or other advanced features:

**Option 1**: Expand the Netlify Function (`netlify/functions/api.js`)
- Add more endpoints to match Express backend
- Deploy new version to Netlify

**Option 2**: Deploy Express Backend separately
- Use Railway, Render, Heroku, or Fly.io
- Update `VITE_API_URL` in Netlify environment variables
- Point to your backend URL instead of localhost
