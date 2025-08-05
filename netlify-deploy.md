# 🎂 Deploy Birthday App to Netlify

## Quick Deploy Instructions

### Option 1: Drag & Drop (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/login with GitHub
3. Drag the `client/build` folder to the deploy area
4. Your site will be live in seconds!

### Option 2: Git-based Deployment (Recommended)

1. **Push your code to GitHub** (if not already):

   ```bash
   git add .
   git commit -m "Add Netlify deployment config"
   git push origin main
   ```

2. **Connect to Netlify**:

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your birthday-app repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Build Settings** (auto-detected):
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

### Option 3: Netlify CLI (Advanced)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from client directory
cd client
netlify deploy --prod --dir=build
```

## 🔄 Backend Configuration

Since this is a full-stack app, you'll need to:

1. **Deploy backend separately** to:

   - [Render.com](https://render.com) (free tier available)
   - [Railway.app](https://railway.app)
   - [Heroku](https://heroku.com)

2. **Update API URL** in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-backend-url.com/api/:splat"
     status = 200
   ```

## ✅ Verification Steps

After deployment:

1. Visit your Netlify URL
2. Check if the birthday app loads
3. Test the birthday message functionality
4. Verify API calls work (if backend is deployed)

## 🎯 Your Netlify URL

Will be: `https://your-app-name-123.netlify.app`

## 🚀 Ready to Deploy!

Your app is configured and ready for Netlify deployment. Choose any option above to get started!
