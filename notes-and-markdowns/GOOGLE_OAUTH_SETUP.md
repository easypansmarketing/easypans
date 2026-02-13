# Google OAuth Setup Guide

## Steps to Configure Google Sign-In

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Create a new project or select an existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized origins: `http://localhost:5173` (for development)
   - Add authorized redirect URIs: `http://localhost:5173`

5. **Update Environment Variables**
   - Copy the Client ID from Google Cloud Console
   - Update `.env` file: `VITE_GOOGLE_CLIENT_ID=your_actual_client_id`
   - Update `backend/.env` file: `GOOGLE_CLIENT_ID=your_actual_client_id`

6. **Test the Integration**
   - Start both frontend and backend servers
   - Try the "Sign in with Google" button on the login page

## Important Notes
- Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID
- For production, add your production domain to authorized origins
- Keep your Client ID secure and don't commit it to public repositories