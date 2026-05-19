# ✅ OceanMind Deployment Checklist

**Use this checklist to track your deployment progress**

---

## 📋 Pre-Deployment Preparation

### Gather Credentials
- [ ] **Supabase Project Created**
  - [ ] Project URL copied
  - [ ] Anon key copied
  - [ ] Database password saved
  
- [ ] **Twilio Account Setup**
  - [ ] Account SID copied
  - [ ] Auth Token copied
  - [ ] WhatsApp sandbox activated
  - [ ] Sandbox number copied
  
- [ ] **OpenAI API Key**
  - [ ] API key created at platform.openai.com
  - [ ] Key copied (starts with sk-)

### Database Setup
- [ ] Schema applied in Supabase SQL Editor
- [ ] All 5 tables verified in Table Editor:
  - [ ] users
  - [ ] vessels
  - [ ] crew
  - [ ] operation_logs
  - [ ] reminders
- [ ] RLS policies enabled

---

## 🖥️ Backend Deployment (Render)

### Account Setup
- [ ] Render account created at render.com
- [ ] GitHub connected
- [ ] Repository access granted

### Service Configuration
- [ ] Web Service created
- [ ] Repository connected: `VALION400/oceanmind-marineops`
- [ ] Name set: `oceanmind-backend`
- [ ] Region selected
- [ ] Branch: `main`
- [ ] Root Directory: (blank)
- [ ] Runtime: Node
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Plan: Free

### Environment Variables (8 total)
- [ ] NODE_ENV = production
- [ ] PORT = 3000
- [ ] TWILIO_ACCOUNT_SID = ACxxxxx
- [ ] TWILIO_AUTH_TOKEN = your_token
- [ ] TWILIO_WHATSAPP_NUMBER = whatsapp:+14155238886
- [ ] OPENAI_API_KEY = sk-xxxxx
- [ ] SUPABASE_URL = https://xxxx.supabase.co
- [ ] SUPABASE_KEY = eyJhbGci...

### Deployment
- [ ] Service created
- [ ] Build completed successfully
- [ ] No errors in logs
- [ ] Health check passes: `GET /health` → `{"status":"ok"}`
- [ ] Backend URL saved

---

## 🌐 Dashboard Deployment (Vercel)

### Account Setup
- [ ] Vercel account created at vercel.com
- [ ] GitHub connected
- [ ] Repository access granted

### Project Configuration
- [ ] Project imported: `VALION400/oceanmind-marineops`
- [ ] Name set: `oceanmind-dashboard`
- [ ] Framework: Next.js (auto-detected)
- [ ] Root Directory: `dashboard`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### Environment Variables (2 total)
- [ ] NEXT_PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...

### Deployment
- [ ] Project deployed
- [ ] Build completed successfully
- [ ] No errors in logs
- [ ] Login page loads
- [ ] Dashboard URL saved

---

## 📱 WhatsApp Configuration

### Twilio Setup
- [ ] WhatsApp sandbox activated
- [ ] "join XXXXX" message sent from phone
- [ ] Confirmation received

### Webhook Configuration
- [ ] Webhook URL set in Twilio:
  ```
  https://YOUR-RENDER-URL.onrender.com/webhook
  ```
- [ ] Changes saved

### Testing
- [ ] Test message sent from WhatsApp
- [ ] AI reply received
- [ ] No errors in Render logs

---

## ✅ End-to-End Testing

### Backend Tests
- [ ] Health check works
- [ ] Webhook endpoint accessible
- [ ] Environment variables loaded
- [ ] Database connection successful

### Dashboard Tests
- [ ] Login page loads
- [ ] Email OTP authentication works
- [ ] All pages accessible after login:
  - [ ] Overview (/dashboard)
  - [ ] Vessels (/dashboard/vessels)
  - [ ] Crew (/dashboard/crew)
  - [ ] Logs (/dashboard/logs)
  - [ ] Reminders (/dashboard/reminders)
  - [ ] Settings (/dashboard/settings)
- [ ] Data displays correctly
- [ ] CRUD operations work

### Integration Tests
- [ ] WhatsApp command creates vessel
- [ ] Dashboard shows new vessel
- [ ] Database has correct record
- [ ] Operation log created
- [ ] Reminder system works

### PWA Tests (Mobile)
- [ ] Dashboard opens on mobile browser
- [ ] "Add to Home Screen" option available
- [ ] App installs successfully
- [ ] App icon appears on home screen
- [ ] App opens in standalone mode
- [ ] All features work in PWA mode

---

## 🎉 Post-Deployment

### Documentation
- [ ] Share dashboard URL with team
- [ ] Provide WhatsApp command reference
- [ ] Document admin credentials
- [ ] Create user guide (optional)

### Monitoring Setup
- [ ] Render logs monitored
- [ ] Vercel analytics checked
- [ ] Supabase query monitoring enabled
- [ ] Error alerts configured (optional)

### Optimization
- [ ] Custom domain configured (optional)
- [ ] SSL certificates verified (automatic)
- [ ] Performance tested
- [ ] Load testing done (optional)

---

## 📊 Deployment Summary

**Backend URL:** _______________________________
*(e.g., https://oceanmind-backend.onrender.com)*

**Dashboard URL:** _______________________________
*(e.g., https://oceanmind-dashboard.vercel.app)*

**WhatsApp Number:** _______________________________

**Supabase Project:** _______________________________

**Deployment Date:** _______________________________

**Deployed By:** _______________________________

---

## 🆘 Issues Encountered

| Issue | Solution | Date Resolved |
|-------|----------|---------------|
|       |          |               |
|       |          |               |
|       |          |               |

---

## ✅ Final Verification

Run through this final checklist:

- [ ] Backend responds to health check
- [ ] Dashboard login works
- [ ] WhatsApp receives messages
- [ ] Database stores data
- [ ] PWA installs on mobile
- [ ] All 5 tables have data
- [ ] No critical errors in logs
- [ ] Team can access dashboard
- [ ] Operators can use WhatsApp

---

**🎉 If all boxes are checked, your deployment is COMPLETE!**

**Next Steps:**
1. Monitor for 1 week
2. Gather user feedback
3. Plan improvements
4. Celebrate! 🚀
