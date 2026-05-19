# 🚀 OceanMind - Step-by-Step Deployment Guide

**Complete manual deployment to Render (Backend) and Vercel (Dashboard)**

---

## 📋 Before You Start

### Gather These Credentials

You'll need these ready before deploying:

#### 1. Supabase Credentials
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**How to get them:**
1. Go to https://app.supabase.com
2. Select your project (or create new one)
3. Click **Settings** (gear icon, bottom left)
4. Click **API**
5. Copy **Project URL** and **anon public** key

#### 2. Twilio Credentials
- **Account SID**: `ACxxxxxxxxxxxxx`
- **Auth Token**: `your_auth_token_here`
- **WhatsApp Number**: `whatsapp:+14155238886` (sandbox number)

**How to get them:**
1. Go to https://console.twilio.com
2. Dashboard shows Account SID and Auth Token
3. For WhatsApp: Go to **Messaging → Try it out → Send a WhatsApp message**
4. Follow sandbox setup instructions
5. Copy the sandbox number

#### 3. OpenAI API Key
- **API Key**: `sk-proj-xxxxxxxxxxxxx`

**How to get it:**
1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Name it "OceanMind"
4. Copy the key (starts with `sk-`)

---

## 🗄️ STEP 0: Database Setup (Supabase) - 5 Minutes

### 1. Create Supabase Project (If Not Done)

1. Go to https://supabase.com
2. Click **Start your project** or **New Project**
3. Choose organization
4. Enter project name: `oceanmind`
5. Set database password (**SAVE THIS!**)
6. Choose region closest to you
7. Click **Create new project**
8. Wait 2-3 minutes for setup

### 2. Apply Database Schema

1. In Supabase Dashboard, click **SQL Editor** (left sidebar, looks like `</>`)
2. Click **New query** (top right)
3. Open file on your computer: `/home/roararena/Desktop/OceanMind/db/schema.sql`
4. Select all text (Ctrl+A) and copy (Ctrl+C)
5. Paste into SQL Editor
6. Click **Run** button (bottom right) or press Ctrl+Enter
7. Wait for success message: "Success. No rows returned"

### 3. Verify Tables Created

1. Click **Table Editor** (left sidebar, looks like a table)
2. You should see 5 tables:
   - ✅ users
   - ✅ vessels
   - ✅ crew
   - ✅ operation_logs
   - ✅ reminders

**✅ Database is ready!**

---

## 🖥️ STEP 1: Deploy Backend to Render - 15 Minutes

### 1. Create Render Account

1. Go to https://render.com
2. Click **Get Started for Free**
3. Click **Continue with GitHub**
4. Authorize Render to access your GitHub account
5. Accept permissions

### 2. Create Web Service

1. After login, click **New +** (top right)
2. Select **Web Service**
3. Under "Connect a repository", find and select:
   ```
   VALION400/oceanmind-marineops
   ```
4. If you don't see it, click **Configure account** and grant access

### 3. Configure Service Settings

Fill in these fields:

**Name:**
```
oceanmind-backend
```

**Region:**
```
Oregon (US West)
```
*(Or choose closest to your users)*

**Branch:**
```
main
```

**Root Directory:**
```
(leave blank)
```

**Runtime:**
```
Node
```

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Plan:**
```
Free
```

### 4. Add Environment Variables

Scroll down to **Environment Variables** section.

Click **Add Environment Variable** and add these ONE BY ONE:

#### Variable 1:
```
Key: NODE_ENV
Value: production
```
Click **Add**

#### Variable 2:
```
Key: PORT
Value: 3000
```
Click **Add**

#### Variable 3:
```
Key: TWILIO_ACCOUNT_SID
Value: ACxxxxxxxxxxxxx (your actual SID from Twilio)
```
Click **Add**

#### Variable 4:
```
Key: TWILIO_AUTH_TOKEN
Value: your_auth_token (from Twilio)
```
Click **Add**

#### Variable 5:
```
Key: TWILIO_WHATSAPP_NUMBER
Value: whatsapp:+14155238886 (or your sandbox number)
```
Click **Add**

#### Variable 6:
```
Key: OPENAI_API_KEY
Value: sk-proj-xxxxx (your OpenAI key)
```
Click **Add**

#### Variable 7:
```
Key: SUPABASE_URL
Value: https://xxxxx.supabase.co (from Supabase)
```
Click **Add**

#### Variable 8:
```
Key: SUPABASE_KEY
Value: eyJhbGci... (Supabase anon key)
```
Click **Add**

**Double-check all 8 variables are added!**

### 5. Deploy

1. Scroll to bottom
2. Click **Create Web Service** (blue button)
3. Wait for deployment (2-3 minutes)
4. Watch the logs in real-time

### 6. Test Deployment

Once deployment completes (green checkmark):

1. Copy your service URL (looks like: `https://oceanmind-backend.onrender.com`)
2. Open new browser tab
3. Go to: `https://YOUR-URL.onrender.com/health`
4. You should see:
   ```json
   {"status":"ok"}
   ```

**✅ Backend is deployed!**

**Save your URL:** `https://oceanmind-backend.onrender.com`

---

## 🌐 STEP 2: Deploy Dashboard to Vercel - 10 Minutes

### 1. Create Vercel Account

1. Go to https://vercel.com
2. Click **Sign Up**
3. Click **Continue with GitHub**
4. Authorize Vercel to access GitHub

### 2. Import Project

1. After login, click **Add New...** (top right)
2. Select **Project**
3. Under "Import Git Repository", find:
   ```
   VALION400/oceanmind-marineops
   ```
4. Click **Import**

### 3. Configure Project

**Project Name:**
```
oceanmind-dashboard
```
*(Auto-filled, you can change it)*

**Framework Preset:**
```
Next.js
```
*(Should be auto-detected)*

**Root Directory:**
1. Click **Edit** next to Root Directory
2. Type: `dashboard`
3. Click **Save**

**Build Command:**
```
npm run build
```
*(Auto-filled)*

**Output Directory:**
```
.next
```
*(Auto-filled)*

### 4. Add Environment Variables

Click **Environment Variables** section.

Add these TWO variables:

#### Variable 1:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co (same as backend)
```

#### Variable 2:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGci... (same as backend)
```

**Important:** These MUST match the Supabase credentials used in backend!

### 5. Deploy

1. Click **Deploy** (blue button)
2. Wait for build (1-2 minutes)
3. Watch the build logs

### 6. Test Dashboard

Once deployment completes:

1. Click **Visit** button
2. Or copy URL (looks like: `https://oceanmind-dashboard.vercel.app`)
3. You should see the **Login page**

**✅ Dashboard is deployed!**

**Save your URL:** `https://oceanmind-dashboard.vercel.app`

---

## 📱 STEP 3: Configure Twilio WhatsApp - 5 Minutes

### 1. Activate WhatsApp Sandbox (If Not Done)

1. Go to https://console.twilio.com
2. Navigate to **Messaging → Try it out → Send a WhatsApp message**
3. You'll see a sandbox number (e.g., `+14155238886`)
4. Follow instructions:
   - Send "join XXXXX" to the sandbox number from your phone
   - Wait for confirmation message
5. Your WhatsApp is now connected!

### 2. Configure Webhook URL

1. In Twilio Console, stay on **WhatsApp Sandbox Settings** page
2. Find field: **When a message comes in**
3. Enter your Render backend URL + `/webhook`:
   ```
   https://oceanmind-backend.onrender.com/webhook
   ```
   *(Replace with your actual Render URL)*
4. Click **Save** at bottom

### 3. Test WhatsApp Integration

1. Open WhatsApp on your phone
2. Send a test message to the sandbox number:
   ```
   Test message
   ```
3. Wait for reply (should receive AI response)
4. Check Render logs for any errors:
   - Go to Render Dashboard
   - Click on `oceanmind-backend`
   - Click **Logs** tab
   - Look for incoming message logs

**✅ WhatsApp is configured!**

---

## ✅ STEP 4: Final Verification

### Test 1: Backend Health Check

```bash
curl https://YOUR-RENDER-URL.onrender.com/health
```

Expected:
```json
{"status":"ok"}
```

### Test 2: Dashboard Login

1. Open: `https://YOUR-VERCEL-URL.vercel.app/login`
2. Should see login form
3. Enter email address
4. Click "Send Magic Link"
5. Check email for OTP
6. Enter OTP and login

### Test 3: WhatsApp Command

Send this WhatsApp message:
```
Update vessel Alpha, status active
```

Expected reply:
```
Vessel "Alpha" created/updated with status: active
```

### Test 4: Dashboard Data

1. Login to dashboard
2. Go to **Vessels** page
3. You should see "Alpha" vessel listed
4. This proves end-to-end integration works!

### Test 5: PWA Installation (Mobile)

On your phone:

1. Open dashboard URL in Chrome/Safari
2. Tap menu (three dots or share button)
3. Look for:
   - Chrome: "Install App" or "Add to Home Screen"
   - Safari: "Add to Home Screen"
4. Tap to install
5. App icon appears on home screen
6. Open app - works like native app!

---

## 🎉 DEPLOYMENT COMPLETE!

### Your Production URLs

**Backend API:**
```
https://oceanmind-backend.onrender.com
```

**Web Dashboard:**
```
https://oceanmind-dashboard.vercel.app
```

**WhatsApp:**
```
Your Twilio sandbox number
```

---

## 📊 Monitoring

### Render Dashboard
- URL: https://dashboard.render.com
- View logs, metrics, uptime

### Vercel Dashboard
- URL: https://vercel.com/dashboard
- View analytics, deployments

### Supabase Dashboard
- URL: https://app.supabase.com
- View database, queries, auth

---

## 🆘 Troubleshooting

### Problem: Backend health check fails

**Solution:**
1. Check Render logs for errors
2. Verify all environment variables are set
3. Check Supabase credentials are correct
4. Restart service in Render dashboard

### Problem: Dashboard shows error

**Solution:**
1. Check Vercel function logs
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Ensure they match backend credentials
4. Clear browser cache and reload

### Problem: WhatsApp not responding

**Solution:**
1. Check webhook URL in Twilio is correct
2. Verify Twilio credentials in Render env vars
3. Check Render logs for webhook errors
4. Ensure WhatsApp sandbox is activated

### Problem: Can't login to dashboard

**Solution:**
1. Check Supabase Auth is enabled
2. Verify email OTP settings in Supabase
3. Check browser console for errors
4. Ensure Supabase credentials are correct

---

## 📞 Next Steps

1. **Share dashboard URL** with your team
2. **Train operators** on WhatsApp commands
3. **Monitor logs** for first week
4. **Set up custom domain** (optional)
5. **Enable automatic deployments** (already configured!)

---

## 🎯 WhatsApp Commands Reference

Operators can send these messages:

```
"Update vessel Alpha, maintenance completed"
"Crew for Vessel Bravo ready"
"When is next maintenance for Vessel X?"
"Remind me about vessel Alpha in 2 days"
"Show me all vessels"
"List crew for vessel Alpha"
```

---

**Congratulations! Your OceanMind system is live! 🚀**
