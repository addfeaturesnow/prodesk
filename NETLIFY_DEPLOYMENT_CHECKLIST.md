# Netlify Deployment Checklist

## Prerequisites ✅
- [x] App structure ready with Netlify Functions API
- [x] `.env` file has Supabase credentials
- [x] `netlify.toml` configured for redirects and functions
- [x] `package.json` has build script

## Before Deploying to Netlify

### 1. Verify Supabase Setup
- [ ] Create a free Supabase account at https://supabase.com
- [ ] Create a new project (or use existing)
- [ ] Note your credentials:
  - Project ID
  - Anon/Publishable Key
  - Project URL
- [ ] Run SQL from `SUPABASE_SETUP.md` to create tables in Supabase
  - Go to SQL Editor in Supabase dashboard
  - Paste and run the SQL scripts

### 2. Update `.env` in Repository
```bash
VITE_SUPABASE_PROJECT_ID="your-actual-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-actual-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

### 3. Connect to GitHub & Netlify
- [ ] Push code to GitHub
- [ ] Go to https://netlify.com
- [ ] Click "New site from Git"
- [ ] Select your repository
- [ ] Netlify auto-detects build settings from `netlify.toml`

### 4. Set Environment Variables on Netlify
- [ ] Go to Site Settings → Build & deploy → Environment
- [ ] Add these variables:
  ```
  VITE_SUPABASE_PROJECT_ID=your-value
  VITE_SUPABASE_PUBLISHABLE_KEY=your-value
  VITE_SUPABASE_URL=your-value
  ```

### 5. Deploy
- [ ] Click "Deploy site"
- [ ] Wait for build to complete
- [ ] Test the app at your Netlify URL

## Testing After Deployment
- [ ] Frontend loads without errors
- [ ] Try navigating to Divers page (should load from Supabase)
- [ ] Try creating a new diver
- [ ] Check browser console for API errors
- [ ] Check Netlify logs if issues occur

## Troubleshooting
- **404 on API endpoints**: Check Supabase tables exist
- **CORS errors**: Already configured in Netlify Function headers
- **Build fails**: Check `npm run build` works locally first
- **Supabase connection fails**: Verify environment variables are set correctly on Netlify

## Features Status on Netlify

### ✅ Working with Supabase:
- Divers (list, create, update, delete)
- Courses (list, create)
- Bookings (basic operations)
- Groups
- Accommodations
- Equipment

### ❌ Not Yet Implemented:
- Transactions & Payments
- POS System
- Rental Assignments
- Advanced operations (incidents, waivers edge cases)

For these, you have two options:
1. **Expand Netlify Functions** - Add endpoints in `netlify/functions/api.js`
2. **Deploy Express Backend** - Use Railway, Render, Heroku alongside Netlify
