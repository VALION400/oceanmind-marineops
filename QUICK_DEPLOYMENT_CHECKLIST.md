# ⚡ Quick Deployment Checklist

**Use this checklist to deploy OceanMind in 30 minutes**

---

## ✅ Pre-Deployment (5 minutes)

- [ ] **Supabase Project Created**
  - URL: https://supabase.com
  - Database password saved
  
- [ ] **Database Schema Applied**
  - File: `db/schema.sql`
  - Run in Supabase SQL Editor
  - All 5 tables created ✓
  
- [ ] **Credentials Gathered**
  - [ ] Supabase URL: `https://_____.supabase.co`
  - [ ] Supabase anon key: `eyJhbG...`
  - [ ] Twilio Account SID
  - [ ] Twilio Auth Token
  - [ ] Twilio WhatsApp Number
  - [ ] OpenAI API Key: `sk-...`

---

## 🚀 Backend Deployment to Render (10 minutes)

### Step 1: Connect to Render

- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Click **New +** → **Web Service**
- [ ] Connect repository: `VALION400/oceanmind-marineops`

### Step 2: Configure Service

- [ ] **Name**: `oceanmind-backend`
- [ ] **Region**: Oregon (or closest)
- [ ] **Branch**: `main`
- [ ] **Root Directory**: Leave blank
- [ ] **Runtime**: Node
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`
- [ ] **Plan**: Free

### Step 3: Add Environment Variables

Add these in Render dashboard:

```env
NODE_ENV=production
PORT=3000
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
OPENAI_API_KEY=sk-your-key-here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Deploy & Test

- [ ] Click **Create Web Service**
- [ ] Wait for build (~2-3 min)
- [ ] Copy your URL: `https://oceanmind-backend.onrender.com`
- [ ] Test health check:
  ```bash
  curl https://your-url.onrender.com/health
  ```
- [ ] Expected: `{"status":"ok"}`

---

## 🌐 Dashboard Deployment to Vercel (10 minutes)

### Step 1: Connect to Vercel

- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Click **Add New...** → **Project**
- [ ] Import: `VALION400/oceanmind-marineops`

### Step 2: Configure Project

- [ ] **Framework Preset**: Next.js
- [ ] **Root Directory**: Click Edit → Type `dashboard`
- [ ] **Build Command**: `npm run build` (auto-detected)
- [ ] **Output Directory**: `.next` (auto-detected)

### Step 3: Add Environment Variables

Add these in Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Must match Supabase credentials from backend!**

### Step 4: Deploy & Test

- [ ] Click **Deploy**
- [ ] Wait for build (~1-2 min)
- [ ] Copy your URL: `https://oceanmind-dashboard.vercel.app`
- [ ] Open in browser
- [ ] Should see login page

---

## 📱 WhatsApp Configuration (5 minutes)

### Step 1: Activate Twilio Sandbox

- [ ] Go to https://console.twilio.com
- [ ] Navigate to **Messaging → Try it out → Send a WhatsApp message**
- [ ] Follow sandbox activation instructions
- [ ] Copy your WhatsApp number

### Step 2: Configure Webhook

- [ ] In Twilio Console: **Messaging → Settings → WhatsApp Sandbox Settings**
- [ ] Set **When a message comes in** to:
  ```
  https://your-render-url.onrender.com/webhook
  ```
- [ ] Click **Save**

### Step 3: Test Integration

- [ ] Send WhatsApp message: `"Test message"`
- [ ] Should receive AI reply
- [ ] Check Render logs for any errors

---

## ✅ Final Verification

### Backend (Render)

- [ ] Health check works: `GET /health` → `{"status":"ok"}`
- [ ] Webhook accessible: `POST /webhook`
- [ ] No errors in Render logs

### Dashboard (Vercel)

- [ ] Login page loads
- [ ] Can sign in with Supabase
- [ ] All pages accessible:
  - [ ] Overview
  - [ ] Vessels
  - [ ] Crew
  - [ ] Logs
  - [ ] Reminders
  - [ ] Settings

### Database (Supabase)

- [ ] All 5 tables exist
- [ ] RLS policies enabled
- [ ] Can query data

### End-to-End Test

- [ ] Send WhatsApp: `"Update vessel Alpha, status active"`
- [ ] Check dashboard → Vessels page shows "Alpha"
- [ ] Check database → vessels table has new record
- [ ] Send WhatsApp: `"Show me all vessels"`
- [ ] Receive reply with vessel list

---

## 🎉 Deployment Complete!

**Your Production URLs:**
- Backend: `https://oceanmind-backend.onrender.com`
- Dashboard: `https://oceanmind-dashboard.vercel.app`
- WhatsApp: Your Twilio number

**Next Steps:**
1. Share dashboard URL with team
2. Train operators on WhatsApp commands
3. Monitor logs on Render/Vercel
4. Set up custom domains (optional)

---

## 🆘 Need Help?

- **Full Guide**: See `DEPLOYMENT_COMPLETE_GUIDE.md`
- **GitHub Repo**: https://github.com/VALION400/oceanmind-marineops
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
