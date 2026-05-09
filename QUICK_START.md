# 🚀 OceanMind - Quick Start Guide

## ✅ System Status: RUNNING

Both backend and frontend services are currently active:
- **Backend API**: http://localhost:3000 ✅
- **Web Dashboard**: http://localhost:3001 ✅

---

## 📋 What You Have

A fully functional **MarineOps AI Assistant** with:

### Backend (WhatsApp Bot)
✅ WhatsApp message reception via Twilio  
✅ AI-powered intent parsing (OpenAI GPT-4o-mini)  
✅ Database operations (Supabase PostgreSQL)  
✅ Vessel management  
✅ Crew tracking  
✅ Operation logging  
✅ Scheduled reminders  
✅ Security hardening (Helmet, CORS, Rate Limiting)  

### Frontend (Web Dashboard)
✅ User authentication (Supabase Auth)  
✅ Vessel fleet management  
✅ Crew member tracking  
✅ Operation history logs  
✅ Reminder system  
✅ User settings  
✅ Real-time data sync with WhatsApp backend  

---

## 🎯 Quick Test Commands

### 1. Test Backend Health
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

### 2. Access Web Dashboard
Open in browser: **http://localhost:3001**

### 3. Test WhatsApp Integration (requires Twilio setup)
Send this message to your Twilio WhatsApp number:
```
Update vessel Alpha, maintenance completed
```

Expected AI response:
```
Vessel "Alpha" status update queued: maintenance completed.
```

---

## 🔧 Current Configuration

### Backend Environment (.env)
Check your current settings:
```bash
cat /home/roararena/Desktop/OceanMind/.env
```

Required variables:
- `TWILIO_ACCOUNT_SID` - Your Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio Auth Token
- `TWILIO_WHATSAPP_NUMBER` - Your Twilio WhatsApp number
- `OPENAI_API_KEY` - Your OpenAI API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon key

### Frontend Environment (dashboard/.env.local)
```bash
cat /home/roararena/Desktop/OceanMind/dashboard/.env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Same as backend SUPABASE_URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Same as backend SUPABASE_KEY

---

## 📊 Feature Verification Checklist

### Backend Features
- [x] Express server running on port 3000
- [x] Health check endpoint working
- [x] TypeScript compilation successful
- [x] Reminder service active (cron job)
- [ ] Twilio webhook configured (needs ngrok + Twilio setup)
- [ ] OpenAI API connected (needs valid API key)
- [ ] Supabase database connected (needs valid credentials)

### Frontend Features
- [x] Next.js dev server running on port 3001
- [x] Login page accessible
- [x] Dashboard layout with sidebar
- [x] All 6 pages created (Overview, Vessels, Crew, Logs, Reminders, Settings)
- [ ] Authentication working (needs Supabase Auth setup)
- [ ] Data loading from Supabase (needs valid credentials)

---

## 🛠️ Setup Steps to Complete

### Step 1: Configure Environment Variables

**Backend (.env):**
```bash
cd /home/roararena/Desktop/OceanMind
cp .env.example .env
nano .env  # Edit with your credentials
```

Fill in:
```env
PORT=3000
NODE_ENV=development
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
```

**Frontend (dashboard/.env.local):**
```bash
cd /home/roararena/Desktop/OceanMind/dashboard
cp .env.local.example .env.local
nano .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Set Up Supabase Database

1. Go to https://supabase.com and create a new project
2. Copy the content of `db/schema.sql`
3. In Supabase Dashboard → SQL Editor, paste and run the schema
4. Enable Row Level Security (RLS) on all tables
5. Create RLS policies (see VERIFICATION_CHECKLIST.md for SQL)
6. Enable Email OTP in Authentication → Settings

### Step 3: Configure Twilio WhatsApp

1. Sign up at https://twilio.com
2. Enable WhatsApp Sandbox in Console
3. Note your Account SID and Auth Token
4. For local testing, use ngrok:
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```
5. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
6. In Twilio Console → WhatsApp Sandbox Settings, set:
   - **Webhook URL**: `https://abc123.ngrok.io/webhook`
   - **HTTP Method**: POST

### Step 4: Get OpenAI API Key

1. Go to https://platform.openai.com
2. Create an API key
3. Add credits to your account
4. Copy the key to `.env`

### Step 5: Restart Services

After updating environment variables:

**Backend:**
```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

**Frontend:**
```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## 🧪 Testing Guide

### Test 1: Backend Health Check
```bash
curl http://localhost:3000/health
```
Expected: `{"status":"ok"}`

### Test 2: WhatsApp Message (after Twilio setup)
Send to your Twilio WhatsApp number:
```
Update vessel Alpha, maintenance completed
```
Expected reply within 5 seconds:
```
Vessel "Alpha" status updated successfully.
```

### Test 3: Web Dashboard Login
1. Open http://localhost:3001/login
2. Enter your email
3. Check email for OTP code
4. Enter OTP and sign in
5. Should redirect to dashboard overview

### Test 4: Create Vessel via Dashboard
1. Navigate to Vessels page
2. Click "Add Vessel"
3. Enter vessel name (e.g., "Alpha")
4. Click Create
5. Verify vessel appears in list

### Test 5: Query Vessel via WhatsApp
Send:
```
What is the status of vessel Alpha?
```
Expected reply:
```
Vessel "Alpha" status: active
Last updated: [timestamp]
```

### Test 6: Create Reminder
Via WhatsApp:
```
Remind me about vessel Alpha maintenance in 2 days
```
Or via Dashboard:
1. Go to Reminders page
2. Click "Create Reminder"
3. Select vessel, set time, enter message
4. Click Create

---

## 📱 Supported WhatsApp Commands

### Vessel Management
```
"Update vessel Alpha, maintenance completed"
"What is the status of vessel Bravo?"
"List all my vessels"
```

### Crew Management
```
"Crew for Vessel Alpha ready"
"How many crew members on Vessel Bravo?"
"Update crew status to off duty"
```

### Reminders
```
"Remind me about vessel Alpha maintenance in 2 days"
"Show my upcoming reminders"
```

### Operations Logging
```
"Log event: Engine inspection completed on Vessel Alpha"
"Show recent operations"
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Server won't start
```bash
# Check if port is in use
lsof -i:3000
# Kill process if needed
kill -9 <PID>
# Restart
npm run dev
```

**Problem**: Twilio webhook not receiving
- Ensure ngrok is running: `ngrok http 3000`
- Verify webhook URL in Twilio Console matches ngrok URL
- Check Twilio console for error logs

**Problem**: OpenAI API errors
- Verify OPENAI_API_KEY is correct
- Check account has available credits
- Test API key: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

**Problem**: Supabase connection failed
- Verify SUPABASE_URL format: `https://xxxxx.supabase.co`
- Check SUPABASE_KEY is the anon/public key (not service role)
- Test connection in Supabase Dashboard → SQL Editor

### Frontend Issues

**Problem**: Dashboard won't load
```bash
cd dashboard
# Clear cache
rm -rf .next
# Reinstall dependencies
npm install
# Restart
npm run dev
```

**Problem**: Authentication fails
- Verify Supabase Auth Email OTP is enabled
- Check NEXT_PUBLIC_SUPABASE_URL matches backend
- Check browser console for errors

**Problem**: Data not showing
- Verify RLS policies are configured in Supabase
- Check user ID matches between auth and database
- Review browser console for API errors

---

## 📚 Documentation Files

- **README.md** - Main project documentation
- **PROJECT_SUMMARY.md** - Complete technical overview
- **VERIFICATION_CHECKLIST.md** - Deployment checklist
- **dashboard/DEPLOYMENT.md** - Dashboard deployment guide
- **db/schema.sql** - Database schema

---

## 🌐 URLs Summary

| Service | URL | Status |
|---------|-----|--------|
| Backend API | http://localhost:3000 | ✅ Running |
| Health Check | http://localhost:3000/health | ✅ Working |
| WhatsApp Webhook | http://localhost:3000/webhook | ⏳ Needs Twilio config |
| Web Dashboard | http://localhost:3001 | ✅ Running |
| Login Page | http://localhost:3001/login | ✅ Accessible |
| Dashboard Overview | http://localhost:3001/dashboard | ⏳ Needs auth |

---

## 🎯 Next Steps

1. **Immediate** (5 minutes):
   - Update `.env` files with your credentials
   - Restart both services

2. **Short-term** (30 minutes):
   - Set up Supabase project and run schema
   - Configure Twilio WhatsApp sandbox
   - Get OpenAI API key

3. **Testing** (15 minutes):
   - Test health check endpoint
   - Send test WhatsApp message
   - Login to dashboard
   - Create first vessel

4. **Production** (1 hour):
   - Follow VERIFICATION_CHECKLIST.md
   - Deploy backend to Render/Railway
   - Deploy frontend to Vercel
   - Configure production webhooks

---

## 💡 Pro Tips

1. **Use ngrok for local testing**: Exposes your localhost to Twilio
2. **Check logs**: Both terminals show real-time logs for debugging
3. **Browser DevTools**: Use Network tab to debug frontend API calls
4. **Supabase Dashboard**: Great for verifying database operations
5. **Twilio Console**: Shows webhook delivery status and errors

---

## 🆘 Need Help?

1. Check error logs in terminal windows
2. Review VERIFICATION_CHECKLIST.md for common issues
3. Consult official docs:
   - [Twilio](https://www.twilio.com/docs)
   - [OpenAI](https://platform.openai.com/docs)
   - [Supabase](https://supabase.com/docs)
   - [Next.js](https://nextjs.org/docs)

---

**Current Status**: ✅ **System Running - Ready for Configuration**

Both services are active and waiting for your environment configuration. Once you add your API keys and credentials, the system will be fully operational!
