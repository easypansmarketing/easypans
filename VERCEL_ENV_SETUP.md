# CRITICAL: Set This in Vercel Dashboard NOW

## The 404 Error Happens Because:
Your frontend is calling `/recipes` on Vercel instead of `https://easypans.onrender.com/api/recipes`

## Fix: Set Environment Variable in Vercel

1. Go to: https://vercel.com/easypans-projects/easypans/settings/environment-variables

2. Add this variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://easypans.onrender.com`
   - **Environment:** Production, Preview, Development (check all)

3. Click "Save"

4. Redeploy:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

## Why This Happens:
- Vite environment variables MUST be set in Vercel dashboard
- `.env` files are NOT deployed to Vercel (they're gitignored)
- Without the env var, your code uses the fallback: `http://localhost:5001`
- Which becomes a relative path `/recipes` in production

## Verify After Redeployment:
Open browser console and check network tab - API calls should go to:
`https://easypans.onrender.com/api/recipes` ✅

NOT:
`https://easypans-8apmoy9vo-easypans-projects.vercel.app/recipes` ❌
