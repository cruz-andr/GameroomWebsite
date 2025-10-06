# Deployment Guide for Paws Gameroom

## Deploy to Vercel (Recommended - FREE)

### Prerequisites
1. GitHub account
2. Vercel account (free at vercel.com)
3. IGDB API credentials (from https://api-docs.igdb.com)

### Step-by-Step Deployment

#### 1. Prepare Your Repository
```bash
# Commit all changes
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 2. Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Select the `paws-gameroom` folder as the root directory
5. Vercel will auto-detect Create React App settings

#### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
IGDB_CLIENT_ID = your_igdb_client_id
IGDB_CLIENT_SECRET = your_igdb_client_secret
```

⚠️ **IMPORTANT**: Never commit these values to GitHub!

#### 4. Deploy

Click "Deploy" and Vercel will:
- Build your React app
- Set up the serverless API functions
- Provide you with a URL like: `https://your-app.vercel.app`

### Your App Structure

```
paws-gameroom/
├── src/              # React frontend
├── api/              # Serverless functions
│   └── games.js      # Games API endpoint
├── public/           # Static files
└── vercel.json       # Vercel configuration
```

### How It Works

1. **Frontend** is served as a static site
2. **API calls** to `/api/games` are handled by serverless functions
3. **No backend server needed** - Vercel handles everything
4. **Automatic deployments** on every git push

### Custom Domain (Optional)

1. Buy a domain or use one you own
2. In Vercel Dashboard → Settings → Domains
3. Add your domain and follow DNS instructions

### Troubleshooting

| Issue | Solution |
|-------|----------|
| API not working | Check environment variables in Vercel dashboard |
| 404 errors | Ensure vercel.json has proper rewrites |
| Build fails | Check build logs in Vercel dashboard |

### Local Development

```bash
# Frontend
cd paws-gameroom
npm start

# Backend (optional, for local testing)
cd paws-gameroom-backend
npm start
```

### Alternative: Deploy to Netlify

If you prefer Netlify:

1. Build the app: `npm run build`
2. Drag the `build` folder to Netlify
3. Set up environment variables
4. For API, use Netlify Functions (requires code changes)

### Cost

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domains supported
  - Perfect for your needs!

- **When to upgrade**: Only if you get 1000+ daily users

### Security Notes

1. API keys are stored securely in Vercel
2. `.env` files are gitignored
3. Serverless functions hide credentials from frontend
4. CORS is configured for your domain only

## Support

If you need help deploying:
1. Check Vercel docs: https://vercel.com/docs
2. Review the error logs in Vercel dashboard
3. Ensure all environment variables are set correctly