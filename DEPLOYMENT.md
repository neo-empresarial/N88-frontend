# Deployment Guide

## Environment Variables

Create a `.env.local` file in the frontend root directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.vercel.app

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:

   - `NEXT_PUBLIC_BACKEND_URL`: Your backend API URL
   - `NEXTAUTH_URL`: Your production frontend URL
   - `NEXTAUTH_SECRET`: A secure random string
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

3. **Deploy** - Vercel will automatically build and deploy your application

## Backend Deployment

Make sure your backend is deployed and accessible at the URL specified in `NEXT_PUBLIC_BACKEND_URL`.

## CORS Configuration

Ensure your backend has CORS configured to allow requests from your frontend domain.

## Features Deployed

- ✅ Schedule sharing between group members
- ✅ Accept/decline shared schedules
- ✅ View sent and received shared schedules
- ✅ Group-based sharing permissions
- ✅ Real-time status updates
- ✅ Clean, production-ready code
