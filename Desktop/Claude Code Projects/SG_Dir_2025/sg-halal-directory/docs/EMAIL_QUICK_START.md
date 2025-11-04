# Email Notifications - Quick Start Guide

> Get up and running with email notifications in 5 minutes

## 1. Get Resend API Key (2 minutes)

```bash
# 1. Visit https://resend.com/signup
# 2. Sign up for free (no credit card)
# 3. Go to https://resend.com/api-keys
# 4. Click "Create API Key"
# 5. Copy the key (starts with re_)
```

## 2. Configure Environment (1 minute)

Add to `.env.local`:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_YOUR_KEY_HERE
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAILS=your-email@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Test It (2 minutes)

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/submit-business
# Fill out form with YOUR email as submitter
# Submit form

# Check console for:
# ✅ Admin notification email sent successfully
# ✅ Submitter confirmation email sent successfully

# Check your email inbox
```

## That's It!

Your email notifications are now working.

---

## Files to Know

| File | Purpose |
|------|---------|
| `/lib/email.ts` | Email sending logic |
| `/app/actions/listing.ts` | Integrated email calls |
| `/docs/EMAIL_IMPLEMENTATION.md` | Complete guide |
| `/tests/email-test.ts` | Test script |

## Common Issues

### Emails not sending?
```bash
# Check .env.local has RESEND_API_KEY
cat .env.local | grep RESEND_API_KEY

# Should show: RESEND_API_KEY=re_...
```

### Emails in spam?
- For testing: This is normal with `onboarding@resend.dev`
- For production: Verify your domain in Resend dashboard

### Wrong sender email?
```bash
# Update in .env.local
RESEND_FROM_EMAIL=onboarding@resend.dev  # Test mode
# OR
RESEND_FROM_EMAIL=noreply@yoursite.com   # Production (after domain verification)
```

## Production Deployment

```bash
# Add to Netlify/Vercel environment variables:
RESEND_API_KEY=re_production_key
RESEND_FROM_EMAIL=noreply@singaporehalaldir.com
ADMIN_EMAILS=admin@singaporehalaldir.com
NEXT_PUBLIC_APP_URL=https://singaporehalaldir.com

# Deploy
git push origin main
```

## Email Templates Preview

### Admin Notification
```
Subject: New Business Submission: [Business Name]

🔔 New Business Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Action Required

Business: Test Restaurant
Type: Restaurant
Area: Marina Bay
Halal Cert: MUIS-HAL-001

[Review Submission →]
```

### Submitter Confirmation
```
Subject: Business Submission Received - Pending Review

✅ Submission Received
━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your submission!

What's next?
1. Review (now)
2. Approval (48 hours)
3. Go Live

💡 Pro Tip: Upgrade to Featured Listing
```

## Cost

- **Free Tier**: 3,000 emails/month
- **Your Usage**: ~120-300 emails/month
- **Cost**: $0/month

## Support

- **Full Docs**: `/docs/EMAIL_IMPLEMENTATION.md`
- **Resend Help**: https://resend.com/docs
- **Test Script**: `npx tsx tests/email-test.ts`

---

**Implementation Status**: ✅ Complete
**Time to Setup**: 5 minutes
**Cost**: Free
**Scalability**: 3,000 emails/month
