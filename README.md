# OceanMind — AI-Powered Marine Operations Management

A production-ready WhatsApp-based AI assistant for marine and offshore operators to manage vessels, crew, and operations via natural language.

---

## Architecture

```
WhatsApp → Twilio Webhook → OpenAI (Intent Parsing) → Business Logic → Supabase (PostgreSQL)
                                                                    ↓
                                                       WhatsApp Reply ← Twilio API
```

## Tech Stack

### Backend (WhatsApp Bot)
| Layer | Technology |
|---|---|
| Backend | Node.js 20 + TypeScript + Express.js |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI GPT-4o-mini (structured JSON output) |
| Messaging | Twilio WhatsApp API |
| Scheduling | node-cron (in-process) |
| Security | Helmet, CORS, Rate Limiting, Twilio Signature Validation |
| Deployment | Docker (Render / Railway) |

### Frontend (Web Dashboard)
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Authentication | Supabase Auth (Email OTP) |
| State Management | React Hooks |
| Deployment | Vercel / Railway / Docker |

---

## Prerequisites

- **Node.js 20+** — [Download](https://nodejs.org/)
- **Twilio Account** — with WhatsApp sandbox enabled — [Twilio Console](https://console.twilio.com/)
- **OpenAI API Key** — [OpenAI Platform](https://platform.openai.com/)
- **Supabase Project** — [Supabase Dashboard](https://supabase.com/)

---

## Quick Start (Development)

### 1. Clone and Install

```bash
git clone <your-repo>
cd OceanMind
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | `development` or `production` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp number (e.g. `whatsapp:+14155238886`) |
| `OPENAI_API_KEY` | OpenAI API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase service role or anon key |

### 3. Set Up Database

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy the content of db/schema.sql and paste into Supabase SQL Editor
# URL: https://app.supabase.com/project/YOUR_PROJECT/sql
```

### 4. Run the Backend Server

```bash
npm run dev
```

Server starts on `http://localhost:3000`. Verify with:

```bash
curl http://localhost:3000/health
# Response: {"status":"ok"}
```

### 5. Set Up Web Dashboard (Optional)

The Next.js dashboard provides a web interface for managing vessels, crew, and operations.

```bash
cd dashboard
npm install
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

Dashboard runs on `http://localhost:3001`

### 6. Expose Webhook (Local Testing)

Use ngrok to expose your local server to Twilio:

```bash
ngrok http 3000
```

Copy the ngrok HTTPS URL and set it in Twilio Console:

1. Go to **Messaging** → **Settings** → **WhatsApp Sandbox Settings**
2. Set **When a message comes in** to: `https://YOUR-NGROK-URL.ngrok-free.app/webhook`
3. Save

### 6. Test via WhatsApp

Send messages to your Twilio WhatsApp Sandbox number:

```
Update vessel Alpha, maintenance completed
Crew for Vessel Bravo ready
When is next maintenance for Vessel X?
Remind me about vessel Alpha maintenance in 2 days
Show my fleet
```

---

## Supported Commands

| Command | Example | Response |
|---|---|---|
| **Update vessel** | `Update vessel Alpha, maintenance completed` | Registers/updates vessel status |
| **Query vessel** | `What is the status of vessel Alpha?` | Returns vessel details |
| **Show fleet** | `Show my fleet` | Lists all your vessels |
| **Update crew** | `Crew for Vessel Bravo ready` | Updates crew status |
| **Query crew** | `How many crew members on vessel Alpha?` | Returns crew count |
| **Log event** | `Log: fuel delivery completed for vessel Alpha` | Records event in logs |
| **Set reminder** | `Remind me about vessel Alpha maintenance in 2 days` | Schedules WhatsApp reminder |
| **Query reminders** | `What reminders do I have?` | Lists pending reminders |

---

## Production Deployment

### Option A: Railway

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Go to [Railway](https://railway.app/) → **New Project** → **Deploy from GitHub**
3. Add environment variables in Railway dashboard (Settings → Variables)
4. Railway auto-detects `package.json` and deploys
5. Copy your Railway URL and update Twilio webhook URL:
   - `https://YOUR-RAILWAY-URL.railway.app/webhook`

### Option B: Render

1. Push your code to a Git repository
2. Go to [Render](https://render.com/) → **New** → **Web Service**
3. Connect your repository
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy and copy the Render URL to Twilio webhook config

### Option C: Docker

```bash
# Build
docker build -t oceanmind .

# Run
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name oceanmind \
  oceanmind

# Or use docker-compose
docker-compose up -d
```

---

## Project Structure

```
OceanMind/
── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml        # Docker Compose for local testing
├── db/
│   └── schema.sql            # Supabase database schema
├── src/
│   ├── index.ts              # App entry point
│   ├── server.ts             # Express server setup
│   ├── config/
│   │   ├── env.ts            # Zod-validated environment config
│   │   └── supabase.ts       # Supabase client singleton
│   ├── routes/
│   │   ├── index.ts          # Route aggregator
│   │   └── whatsapp.ts       # Twilio webhook handler
│   ├── services/
│   │   ├── aiService.ts      # OpenAI intent parsing
│   │   ├── twilioService.ts  # Twilio message sending
│   │   └── reminderService.ts # Cron-based reminder engine
│   ├── business/
│   │   ├── vesselHandler.ts  # Vessel CRUD logic
│   │   ├── crewHandler.ts    # Crew status logic
│   │   ├── logHandler.ts     # Operation log logic
│   │   └── reminderHandler.ts # Reminder CRUD logic
│   ├── middleware/
│   │   ├── errorHandler.ts   # Global error handler
│   │   ├── requestValidator.ts # Twilio signature validation
│   │   └── rateLimiter.ts    # Per-IP rate limiting
│   ── types/
│       └── index.ts          # TypeScript interfaces
└── README.md                 # This file
```

---

## Security

- **Environment Variables**: All secrets loaded from `.env` (never committed)
- **Twilio Signature Validation**: Production requests verified against Twilio's signature
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
- **CORS**: Restricted to production domain in production mode
- **Multi-Tenant Isolation**: Every database query scoped by `user_id` (derived from phone number)
- **Row-Level Security**: Supabase RLS policies restrict data access per user

---

## Web Dashboard Features

The Next.js dashboard (`/dashboard`) provides a comprehensive web interface:

### Pages

1. **Overview** - Real-time statistics, vessel count, crew status, recent activity
2. **Vessels** - Create, update, and manage vessel fleet with status tracking
3. **Crew** - Add crew members, assign to vessels, track duty status
4. **Logs** - Filterable operation history with timestamps and details
5. **Reminders** - Create scheduled reminders, view active/completed tasks
6. **Settings** - User profile, account management, sign out

### Authentication

- Supabase Auth with Email OTP
- Session persistence across page reloads
- Protected routes (redirects to login if unauthenticated)

### Data Synchronization

- Shares same Supabase database as WhatsApp backend
- Real-time updates when WhatsApp messages create/modify records
- Unified user identity (phone number ↔ email)

### Deployment

See `dashboard/DEPLOYMENT.md` for detailed deployment instructions.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `EADDRINUSE :::3000` | Port 3000 already in use | Kill existing process or change `PORT` in `.env` |
| `Environment variable validation failed` | Missing `.env` values | Copy `.env.example` to `.env` and fill all fields |
| `Supabase connection error` | Invalid URL or key | Verify `SUPABASE_URL` and `SUPABASE_KEY` |
| `OpenAI API error` | Invalid or expired key | Check `OPENAI_API_KEY` at platform.openai.com |
| `Twilio error 21211` | Invalid WhatsApp number format | Ensure `TWILIO_WHATSAPP_NUMBER` starts with `whatsapp:+` |
| `Table does not exist` | Schema not applied | Run `db/schema.sql` in Supabase SQL Editor |

---

## API Reference

### Health Check

```
GET /health
Response: {"status":"ok"}
```

### WhatsApp Webhook

```
POST /webhook
Body (form-encoded by Twilio):
  From: whatsapp:+1234567890
  Body: User message text
  MessageSid: SMxxxxxxxx
Response: Empty (TwiML handled by Twilio API)
```

---

## Development Commands

```bash
npm run dev      # Start with nodemon (hot reload)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled production build
npm run clean    # Remove dist/ directory
```

---

## License

MIT

---

## Next Steps (Phase 9 — Optional)

- **Next.js Dashboard**: Web-based UI for vessel/crew management
- **Authentication**: Supabase Auth for dashboard login
- **Analytics**: Vessel utilization metrics, crew scheduling reports
- **Multi-language**: Support for additional languages via OpenAI
- **Voice Integration**: Twilio Voice API for phone call support
