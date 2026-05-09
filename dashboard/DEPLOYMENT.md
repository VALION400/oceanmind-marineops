# OceanMind Dashboard - Deployment Guide

## Prerequisites

- Supabase project with database schema applied
- Twilio account with WhatsApp Business API configured
- OpenAI API key

## Local Development Setup

### 1. Install Dependencies

```bash
cd dashboard
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3001`

### 4. Access the Dashboard

1. Navigate to `http://localhost:3001/login`
2. Sign in using the phone number associated with your WhatsApp account
3. You'll receive an OTP via email (configure Supabase Auth settings)
4. After authentication, you'll access the full dashboard

## Production Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

### Option 2: Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

### Option 3: Docker

```bash
docker build -t oceanmind-dashboard .
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  oceanmind-dashboard
```

## Supabase Configuration

### Enable Email OTP Authentication

1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Email OTP" under External OAuth Providers
3. Configure email templates if needed

### Row Level Security (RLS)

Ensure RLS policies are enabled on all tables:

```sql
-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Vessels table
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vessels"
ON vessels FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vessels"
ON vessels FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vessels"
ON vessels FOR UPDATE
USING (auth.uid() = user_id);

-- Repeat for crew, operation_logs, reminders tables
```

## Features

### Dashboard Pages

1. **Overview** - System statistics and quick actions
2. **Vessels** - Manage vessel fleet, update statuses
3. **Crew** - Track crew members, duty status
4. **Logs** - View operation history and activity logs
5. **Reminders** - Create and manage scheduled reminders
6. **Settings** - Account information and preferences

### Integration with WhatsApp Backend

The dashboard shares the same Supabase database as the WhatsApp backend, ensuring:
- Real-time synchronization between WhatsApp messages and web interface
- Unified data model across both platforms
- Consistent user authentication

## Troubleshooting

### Cannot Connect to Supabase

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that the anon key has proper permissions
- Ensure Supabase project is active

### Authentication Issues

- Verify Supabase Auth is configured correctly
- Check that email OTP is enabled
- Ensure CORS settings allow your domain

### Data Not Showing

- Verify RLS policies are correctly configured
- Check browser console for errors
- Ensure user ID matches between auth and database records

## API Integration

The dashboard uses the Supabase client directly. For custom API calls to the Express backend:

```typescript
const response = await fetch('http://localhost:3000/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

## Security Best Practices

1. Never commit `.env.local` to version control
2. Use environment-specific keys for development/staging/production
3. Enable RLS on all database tables
4. Regularly rotate API keys
5. Monitor authentication logs in Supabase

## Support

For issues or questions:
- Check the main README.md in the project root
- Review Supabase documentation: https://supabase.com/docs
- Review Next.js documentation: https://nextjs.org/docs
