# ⚡ OceanMind - 5-Minute Deployment Quick Reference

**GitHub**: https://github.com/VALION400/oceanmind-marineops

---

## 🎯 Deploy in 3 Steps

### Step 1: Supabase (Database) - 5 min

1. Create project at https://supabase.com
2. Run `db/schema.sql` in SQL Editor
3. Copy credentials from Settings → API:
   - Project URL
   - anon/public key

### Step 2: Render (Backend) - 10 min

1. Go to https://render.com → New Web Service
2. Connect: `VALION400/oceanmind-marineops`
3. Settings:
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. Add env vars:
   ```
   NODE_ENV=production
   PORT=3000
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   OPENAI_API_KEY=sk-...
   SUPABASE_URL=https://....supabase.co
   SUPABASE_KEY=eyJ...
   ```
5. Deploy & test: `curl https://your-url.onrender.com/health`

### Step 3: Vercel (Dashboard) - 10 min

1. Go to https://vercel.com → New Project
2. Import: `VALION400/oceanmind-marineops`
3. Root Directory: `dashboard`
4. Add env vars:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. Deploy & visit URL

---

## 📱 WhatsApp Setup - 5 min

1. Twilio Console → Messaging → WhatsApp Sandbox
2. Activate sandbox
3. Set webhook to: `https://your-render-url.onrender.com/webhook`
4. Test by sending message

---

## ✅ Verify

- Backend: `GET /health` → `{"status":"ok"}`
- Dashboard: Login page loads
- WhatsApp: Send message → Get AI reply
- Database: Check Supabase tables

---

## 📚 Full Guides

- **Quick Checklist**: `QUICK_DEPLOYMENT_CHECKLIST.md`
- **Complete Guide**: `DEPLOYMENT_COMPLETE_GUIDE.md`
- **Full Summary**: `DEPLOYMENT_READY_SUMMARY.md`

---

## 🆘 Troubleshooting

**Health check fails?**
→ Check Render logs, verify env vars

**Dashboard shows error?**
→ Verify Supabase credentials match

**WhatsApp not working?**
→ Check webhook URL in Twilio

**Database errors?**
→ Re-run `db/schema.sql`

---

**Need help?** See full guides above or check GitHub issues.
