# Frontend-Backend Connection Fix

## Problem
Your frontend was calling `/recipes` which resulted in 404 errors on Vercel because:
- Relative paths like `/recipes` resolve to `https://easypans-l3zh42ekc-easypans-projects.vercel.app/recipes`
- But your API is on Render at `https://easypans.onrender.com/api/recipes`

## Why Relative Paths Break in Production

### Development (localhost)
- Frontend: `http://localhost:8081`
- Backend: `http://localhost:5001`
- Relative path `/api/recipes` → `http://localhost:8081/api/recipes` ❌ (Wrong!)

### Production (Vercel + Render)
- Frontend: `https://easypans.vercel.app`
- Backend: `https://easypans.onrender.com`
- Relative path `/api/recipes` → `https://easypans.vercel.app/api/recipes` ❌ (Wrong!)

**Solution:** Always use absolute URLs with environment variables.

## What Was Fixed

### 1. Environment Variables Setup

**`.env.local`** (for local development):
```
VITE_API_BASE_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=116310755546-h37cahe4r0b8n8tbaopuiimk7d1fgp24.apps.googleusercontent.com
```

**`.env.production`** (for Vercel deployment):
```
VITE_API_BASE_URL=https://easypans.onrender.com
VITE_GOOGLE_CLIENT_ID=116310755546-h37cahe4r0b8n8tbaopuiimk7d1fgp24.apps.googleusercontent.com
```

### 2. Frontend Code Pattern (Already Correct!)

All your files already use this pattern:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Then use it like:
const response = await fetch(`${API_BASE_URL}/api/recipes`);
```

**Files using this pattern:**
- ✅ `src/pages/Recipes.tsx`
- ✅ `src/pages/RecipeDetail.tsx`
- ✅ `src/pages/Login.tsx`
- ✅ `src/pages/admin/AdminRecipes.tsx`
- ✅ `src/pages/admin/AdminRecipeDetail.tsx`
- ✅ `src/pages/admin/RecipeForm.tsx`

### 3. Backend CORS Configuration

Updated `backend/server.js` to allow your Vercel URLs:

```javascript
const allowedOrigins = [
    'http://localhost:8081',
    'http://localhost:8080',
    'http://172.20.10.6:8081',
    'https://easypans-git-website-dev-easypans-projects.vercel.app',
    'https://easypans-l3zh42ekc-easypans-projects.vercel.app',
    'https://easypans.vercel.app'
];
```

## Deployment Steps

### For Vercel (Frontend)

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://easypans.onrender.com`
   - Add: `VITE_GOOGLE_CLIENT_ID` = `116310755546-h37cahe4r0b8n8tbaopuiimk7d1fgp24.apps.googleusercontent.com`

2. **Redeploy:**
   ```bash
   git add .
   git commit -m "Fix API URL configuration"
   git push
   ```

### For Render (Backend)

1. **Set Environment Variables in Render Dashboard:**
   - Add: `FRONTEND_URL` = `https://easypans-l3zh42ekc-easypans-projects.vercel.app,https://easypans.vercel.app`
   - Keep existing: `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, etc.

2. **Redeploy** (automatic on git push or manual trigger)

## Testing

### Local Development
```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend
cd ..
npm run dev
```

### Production
1. Visit: `https://easypans-l3zh42ekc-easypans-projects.vercel.app`
2. Check browser console for API calls
3. Verify they go to: `https://easypans.onrender.com/api/...`

## Common Mistakes to Avoid

❌ **Don't use relative paths:**
```typescript
fetch('/api/recipes')  // Wrong!
```

✅ **Always use environment variable:**
```typescript
fetch(`${API_BASE_URL}/api/recipes`)  // Correct!
```

❌ **Don't hardcode URLs:**
```typescript
fetch('http://localhost:5001/api/recipes')  // Wrong!
```

✅ **Use env variable with fallback:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
```

## File Structure

```
easypans/
├── .env.local              # Local development (gitignored)
├── .env.production         # Production build (gitignored)
├── .env                    # Default (now points to Render)
├── backend/
│   ├── .env               # Backend config
│   └── server.js          # CORS configuration
└── src/
    └── pages/
        ├── Recipes.tsx           # ✅ Uses API_BASE_URL
        ├── RecipeDetail.tsx      # ✅ Uses API_BASE_URL
        ├── Login.tsx             # ✅ Uses API_BASE_URL
        └── admin/
            ├── AdminRecipes.tsx  # ✅ Uses API_BASE_URL
            └── RecipeForm.tsx    # ✅ Uses API_BASE_URL
```

## Verification Checklist

- [x] All frontend files use `API_BASE_URL` environment variable
- [x] `.env.production` created with Render URL
- [x] `.env.local` created for local development
- [x] Backend CORS includes all Vercel URLs
- [x] No hardcoded `localhost:5001` in production code
- [ ] Environment variables set in Vercel dashboard
- [ ] Environment variables set in Render dashboard
- [ ] Frontend redeployed to Vercel
- [ ] Backend redeployed to Render
- [ ] Test API calls in production

## Next Steps

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Configure production API URLs"
   git push
   ```

2. **Set Vercel environment variables** (see above)

3. **Set Render environment variables** (see above)

4. **Test production deployment**
