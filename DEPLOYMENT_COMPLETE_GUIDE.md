# 🚀 OceanMind Deployment Guide

**Complete production deployment for Backend (Render) and Dashboard (Vercel)**

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ **Supabase Project** with database schema applied
2. ✅ **Twilio Account** with WhatsApp Business API configured
3. ✅ **OpenAI API Key** from https://platform.openai.com
4. ✅ **GitHub Repository** connected to Render and Vercel

---

## 🗄️ Step 0: Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and project name: `oceanmind`
4. Set database password (save it!)
5. Choose region closest to your users
6. Wait for project to initialize (~2 minutes)

### 2. Apply Database Schema

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open file: `/home/roararena/Desktop/OceanMind/db/schema.sql`
4. Copy entire contents
5. Paste into SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success message

### 3. Get Supabase Credentials

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...` (long string starting with eyJ)

**Save these! You'll need them for deployment.**

---

## 🔧 Step 1: Backend Deployment (Render)

### Option A: Deploy via Render Dashboard (Recommended)

#### 1. Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### 2. Create Web Service

1. Click **New +** → **Web Service**
2. Connect repository: `VALION400/oceanmind-marineops`
3. Configure service:
   - **Name**: `oceanmind-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (backend is in root)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### 3. Add Environment Variables

Click **Advanced** → **Add Environment Variable** and add:

```env
NODE_ENV=production
PORT=3000
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
OPENAI_API_KEY=sk-your-openai-key-here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
```

**Where to get these:**
- **Twilio credentials**: https://console.twilio.com
- **OpenAI key**: https://platform.openai.com/api-keys
- **Supabase URL & Key**: Supabase Dashboard → Settings → API

#### 4. Deploy

1. Click **Create Web Service**
2. Wait for build (~2-3 minutes)
3. Once deployed, copy your service URL (e.g., `https://oceanmind-backend.onrender.com`)

#### 5. Test Deployment

```bash
curl https://your-render-url.onrender.com/health
```

Expected response:
```json
{"status":"ok"}
```

---

### Option B: Deploy via render.yaml (Automatic)

1. Go to https://dashboard.render.com
2. Click **New +** → **Blueprint**
3. Connect repository: `VALION400/oceanmind-marineops`
4. Render will auto-detect `render.yaml`
5. Fill in environment variables in the dashboard
6. Click **Apply**

---

## 🌐 Step 2: Dashboard Deployment (Vercel)

### 1. Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### 2. Import Project

1. Click **Add New...** → **Project**
2. Import repository: `VALION400/oceanmind-marineops`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `dashboard` (click Edit and type `dashboard`)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### 3. Add Environment Variables

Click **Environment Variables** and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

**Important:** These must match the Supabase credentials from Step 0.

### 4. Deploy

1. Click **Deploy**
2. Wait for build (~1-2 minutes)
3. Once deployed, you'll get a URL like: `https://oceanmind-dashboard.vercel.app`

### 5. Test Dashboard

1. Open your Vercel URL in browser
2. You should see the login page
3. Login will work once Supabase Auth is configured

---

## 🔐 Step 3: Twilio WhatsApp Configuration

### 1. Get Twilio WhatsApp Number

1. Go to https://console.twilio.com
2. Navigate to **Messaging → Try it out → Send a WhatsApp message**
3. Follow instructions to activate sandbox
4. Copy your WhatsApp number (e.g., `whatsapp:+14155238886`)

### 2. Configure Webhook

1. In Twilio Console, go to **Messaging → Settings → WhatsApp Sandbox Settings**
2. Set **When a message comes in** to:
   ```
   https://your-render-url.onrender.com/webhook
   ```
3. Click **Save**

### 3. Test WhatsApp Integration

1. Send a WhatsApp message to your Twilio sandbox number
2. You should receive an AI-powered reply
3. Check Render logs for any errors

---

## ✅ Step 4: Verification Checklist

### Backend (Render)

- [ ] Health check responds: `GET /health` → `{"status":"ok"}`
- [ ] Webhook endpoint accessible: `POST /webhook`
- [ ] Environment variables loaded correctly
- [ ] Logs show no errors in Render dashboard

### Dashboard (Vercel)

- [ ] Login page loads at root URL
- [ ] Can authenticate with Supabase
- [ ] All pages accessible after login:
  - [ ] Overview (`/dashboard`)
  - [ ] Vessels (`/dashboard/vessels`)
  - [ ] Crew (`/dashboard/crew`)
  - [ ] Logs (`/dashboard/logs`)
  - [ ] Reminders (`/dashboard/reminders`)
  - [ ] Settings (`/dashboard/settings`)

### Database (Supabase)

- [ ] All 5 tables created:
  - [ ] `users`
  - [ ] `vessels`
  - [ ] `crew`
  - [ ] `operation_logs`
  - [ ] `reminders`
- [ ] Row Level Security (RLS) policies enabled
- [ ] Can insert and query data via SQL Editor

### WhatsApp Integration

- [ ] Twilio webhook configured
- [ ] Sending message triggers AI parsing
- [ ] Database updates on vessel/crew commands
- [ ] Reminder system working

---

## 🔍 Troubleshooting

### Backend Issues

**Problem**: Health check fails
```bash
curl https://your-url.onrender.com/health
```
**Solution**: Check Render logs for startup errors. Verify all environment variables are set.

**Problem**: WhatsApp replies not working
**Solution**: 
1. Check Twilio webhook URL is correct
2. Verify Twilio credentials in environment variables
3. Check Render logs for webhook errors

### Dashboard Issues

**Problem**: Login page shows error
**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.

**Problem**: Pages show "No data"
**Solution**: Ensure database schema is applied and RLS policies allow access.

### Database Issues

**Problem**: Tables not found
**Solution**: Re-run `db/schema.sql` in Supabase SQL Editor.

**Problem**: Permission denied errors
**Solution**: Check RLS policies are correctly configured.

---

## 📊 Monitoring

### Render Dashboard
- View logs: https://dashboard.render.com
- Monitor uptime and response times
- Check resource usage

### Vercel Dashboard
- View analytics: https://vercel.com/dashboard
- Monitor function invocations
- Check deployment history

### Supabase Dashboard
- View database queries: https://app.supabase.com
- Monitor storage usage
- Check authentication logs

---

## 🎯 Post-Deployment Tasks

1. **Set up custom domain** (optional)
   - Render: Settings → Custom Domain
   - Vercel: Settings → Domains

2. **Configure SSL certificates** (automatic on both platforms)

3. **Set up monitoring alerts**
   - Render: Notifications
   - Vercel: Alerts

4. **Enable automatic deployments**
   - Both platforms auto-deploy on git push to main

5. **Test end-to-end flow**
   - Send WhatsApp message → Verify database update → Check dashboard reflects changes

---

## 📞 Support

If you encounter issues:

1. Check platform-specific logs (Render/Vercel/Supabase)
2. Verify all environment variables are set correctly
3. Review this guide step-by-step
4. Check GitHub issues: https://github.com/VALION400/oceanmind-marineops/issues

---

## 🎉 Success!

Once all checks pass, your OceanMind system is live and production-ready!

**Your URLs:**
- Backend API: `https://oceanmind-backend.onrender.com`
- Web Dashboard: `https://oceanmind-dashboard.vercel.app`
- WhatsApp: Send messages to your Twilio number

**Next Steps:**
- Share dashboard URL with your team
- Train operators on WhatsApp commands
- Monitor usage and optimize as needed
