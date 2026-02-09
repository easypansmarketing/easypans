# Render Backend 500 Error Fix

## The 500 error means your backend is crashing on Render.

## Most Common Cause: Missing Environment Variables

### Check Render Dashboard Environment Variables:

Go to: https://dashboard.render.com → Your Service → Environment

**Required Variables:**

1. **MONGO_URI**
   ```
   mongodb://easypans_admin:PK747-748@ac-gbyuef3-shard-00-00.gegzxvh.mongodb.net:27017,ac-gbyuef3-shard-00-01.gegzxvh.mongodb.net:27017,ac-gbyuef3-shard-00-02.gegzxvh.mongodb.net:27017/easypans?ssl=true&replicaSet=atlas-14iy8t-shard-0&authSource=admin&retryWrites=true&w=majority
   ```

2. **JWT_SECRET**
   ```
   a_very_secret_and_random_string_12345
   ```

3. **GOOGLE_CLIENT_ID**
   ```
   116310755546-h37cahe4r0b8n8tbaopuiimk7d1fgp24.apps.googleusercontent.com
   ```

4. **MAIL_USER**
   ```
   easypans.marketing@gmail.com
   ```

5. **MAIL_PASS**
   ```
   sytj kygr twnn qojz
   ```

6. **APILAYER_API_KEY**
   ```
   SE9vsRLdU4E1toJNoLHZFMLikFnFfKyK
   ```

7. **FRONTEND_URL**
   ```
   https://easypans-8apmoy9vo-easypans-projects.vercel.app,https://easypans.vercel.app
   ```

8. **PORT** (Optional - Render sets this automatically)
   ```
   10000
   ```

## After Setting Variables:

1. Click "Save Changes"
2. Render will automatically redeploy
3. Check logs: Dashboard → Logs tab
4. Look for "MongoDB Connected" message

## Test Backend Directly:

Visit: https://easypans-backend.onrender.com/

Should see: "API is running in development mode..."

## If Still 500 Error:

Check Render logs for:
- "MongoDB Connection Error"
- "MONGO_URI: NOT SET"
- Any other error messages

## MongoDB Atlas Whitelist:

Make sure MongoDB Atlas allows connections from anywhere:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (Allow from anywhere)
3. This is required for Render to connect
