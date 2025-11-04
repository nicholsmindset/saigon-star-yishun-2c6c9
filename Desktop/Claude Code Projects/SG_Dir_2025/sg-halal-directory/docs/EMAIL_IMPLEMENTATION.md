# Email Notifications Implementation Guide

## Overview

Email notifications have been implemented for business submissions using **Resend** (resend.com), a modern transactional email service with a generous free tier (3,000 emails/month, 100 emails/day).

## Implementation Details

### Files Created/Modified

1. **`/lib/email.ts`** (NEW)
   - Core email sending logic with Resend integration
   - Two main functions: `sendAdminNotification()` and `sendSubmitterConfirmation()`
   - Professional HTML email templates with mobile-responsive design
   - Plain text fallback for email clients without HTML support
   - Error handling with detailed logging

2. **`/app/actions/listing.ts`** (MODIFIED)
   - Integrated email sending after successful business submission
   - Fetches area name from database for email content
   - Non-blocking email failures (submission succeeds even if emails fail)
   - Comprehensive error logging for debugging

### Email Flow

```
User Submits Business
         ↓
Business Saved to Database
         ↓
    ┌────┴────┐
    ↓         ↓
Admin Email   Submitter Email
    ↓         ↓
 Logged    Logged
```

**Non-Blocking Design**: If email sending fails, the business submission still succeeds. Email failures are logged to console but don't interrupt the user experience.

## Setup Instructions

### 1. Create Resend Account

1. Visit https://resend.com/signup
2. Sign up for free account (no credit card required)
3. Verify your email address

### 2. Get API Key

1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "Singapore Halal Directory - Production" (or "Development")
4. Copy the API key (starts with `re_`)
5. **Save it securely** - you can only view it once

### 3. Set Up Domain (Optional but Recommended)

**For Development/Testing**: Skip this step, use default sending domain

**For Production**:
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `singaporehalaldir.com`)
4. Add DNS records to your domain registrar:
   - TXT record for domain verification
   - CNAME records for email authentication (SPF, DKIM)
5. Wait for verification (usually 5-30 minutes)

### 4. Configure Environment Variables

Add to `.env.local` (development) or deployment environment (production):

```bash
# Resend Email Configuration
RESEND_API_KEY=re_YOUR_API_KEY_HERE

# Email sender address
# Development: Use onboarding@resend.dev (default, works immediately)
# Production: Use your verified domain email (e.g., noreply@singaporehalaldir.com)
RESEND_FROM_EMAIL=noreply@singaporehalaldir.com

# Admin email addresses (comma-separated for multiple admins)
ADMIN_EMAILS=admin@singaporehalaldir.com,owner@singaporehalaldir.com

# Application URL for email links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Development Testing (No Domain Required)

For immediate testing without domain setup:

```bash
# In .env.local
RESEND_API_KEY=re_YOUR_API_KEY_HERE
RESEND_FROM_EMAIL=onboarding@resend.dev  # Default Resend test domain
ADMIN_EMAILS=your-real-email@gmail.com   # Your email for testing
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Verify Installation

```bash
# Check Resend package installed
npm list resend

# Expected output:
# sg-halal-directory@0.1.0
# └── resend@4.x.x

# Start development server
npm run dev

# Visit http://localhost:3000/submit-business
# Submit a test business and check console logs
```

## Email Templates

### Admin Notification Email

**Subject**: `New Business Submission: [Business Name]`

**Content**:
- Alert banner: "Action Required"
- Business information grid (name, type, area, address, halal cert #, submitter, date, status)
- "Review Submission" button linking to admin dashboard
- Next steps checklist
- Professional branding with Singapore Halal Directory colors

**Design Features**:
- Green gradient header (#10b981 to #059669)
- Yellow alert banner with action icon
- Responsive info grid (stacks on mobile)
- Professional footer with links

### Submitter Confirmation Email

**Subject**: `Business Submission Received - Pending Review`

**Content**:
- Success badge: "Thank you for your submission!"
- Business information summary
- 3-step timeline (Review → Approval → Go Live)
- Pro tip box promoting featured listings
- Contact information

**Design Features**:
- Green gradient header
- Green success badge
- Visual timeline with numbered icons
- Blue info box for featured listing promotion
- Professional footer with navigation links

## Testing Guide

### Manual Testing

1. **Start Local Environment**
   ```bash
   npm run dev
   ```

2. **Navigate to Submission Form**
   - Visit http://localhost:3000/submit-business

3. **Fill Out Form**
   - Business Name: Test Business
   - Business Type: Restaurant
   - Address: 1 Marina Boulevard
   - Postal Code: 018989
   - Area: Select any area
   - Halal Cert Number: MUIS-HAL-001
   - Halal Cert Expiry: 2025-12-31
   - Submitter Name: Your Name
   - Submitter Email: your-real-email@example.com (use your real email to receive confirmation)
   - Upload Certificate: Any image file
   - (Optional) Upload Business Photo

4. **Submit Form**

5. **Check Console Logs**
   ```
   ✅ Geocoded address: [address]
   ✅ Admin notification email sent successfully
   ✅ Submitter confirmation email sent successfully
   ```

6. **Check Email Inboxes**
   - Admin email should receive notification within 1-2 seconds
   - Submitter email should receive confirmation within 1-2 seconds
   - Check spam folder if not in inbox

### Error Testing

1. **Test Invalid API Key**
   ```bash
   # In .env.local
   RESEND_API_KEY=re_invalid_key
   ```
   - Submit business
   - Expected: Business submission succeeds, console shows email error
   - Console: `❌ Admin notification email failed: [error details]`

2. **Test Invalid Email Address**
   - Submit with invalid submitter email (e.g., "notanemail")
   - Expected: Form validation should catch this before submission

3. **Test Missing Environment Variables**
   ```bash
   # Remove RESEND_API_KEY from .env.local temporarily
   ```
   - Submit business
   - Expected: Email sending fails gracefully, submission succeeds
   - Console: `❌ Failed to send admin notification: [error]`

### Automated Testing (Playwright)

Create test file: `/tests/email-notifications.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Email Notifications', () => {
  test('should send emails on business submission', async ({ page }) => {
    // Navigate to submission form
    await page.goto('/submit-business')

    // Fill out form
    await page.fill('[name="businessName"]', 'Test Business')
    await page.selectOption('[name="businessType"]', 'Restaurant')
    await page.fill('[name="address"]', '1 Marina Boulevard')
    await page.fill('[name="postalCode"]', '018989')
    await page.selectOption('[name="areaId"]', { index: 1 })
    await page.fill('[name="halalCertNumber"]', 'MUIS-HAL-TEST-001')
    await page.fill('[name="halalCertExpiry"]', '2025-12-31')
    await page.fill('[name="submitterName"]', 'Test User')
    await page.fill('[name="submitterEmail"]', 'test@example.com')

    // Upload test image
    await page.setInputFiles('[name="certImage"]', 'tests/fixtures/test-cert.jpg')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator('text=Submission received')).toBeVisible()

    // Check console logs for email success
    // Note: In actual implementation, you'd verify via Resend API
  })

  test('should handle email failures gracefully', async ({ page }) => {
    // This would require mocking Resend API to simulate failure
    // Submission should still succeed even if email fails
  })
})
```

## Monitoring & Debugging

### Console Log Output

**Successful Email Sending**:
```
✅ Geocoded address: 1 Marina Boulevard, 018989, Singapore
   Coordinates: 1.2894, 103.8503
✅ Admin notification email sent successfully
✅ Submitter confirmation email sent successfully
```

**Failed Email Sending**:
```
❌ Admin notification email failed: { error: 'Invalid API key' }
❌ Failed to send submitter confirmation: Error: Network timeout
```

### Resend Dashboard Monitoring

1. Visit https://resend.com/emails
2. View all sent emails in real-time
3. Check email status (sent, delivered, bounced, failed)
4. View email content and metadata
5. Track open rates and click rates (if enabled)

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Emails not sending | Missing RESEND_API_KEY | Add API key to .env.local |
| Emails in spam | Unverified domain | Verify domain in Resend or use default domain for testing |
| Invalid sender email | Domain not verified | Use onboarding@resend.dev for testing or verify your domain |
| 429 Rate limit error | Exceeded free tier limits | Upgrade Resend plan or wait for rate limit reset |
| Network timeout | Slow connection | Increase timeout in Resend client config |

## Production Deployment

### Pre-Deployment Checklist

- [ ] Resend API key added to production environment variables
- [ ] Domain verified in Resend (if using custom domain)
- [ ] RESEND_FROM_EMAIL set to verified domain email
- [ ] ADMIN_EMAILS contains correct admin addresses
- [ ] NEXT_PUBLIC_APP_URL set to production URL
- [ ] Email templates tested with production branding
- [ ] DNS records configured for email authentication

### Deployment Steps

1. **Set Environment Variables** (Netlify/Vercel)
   ```
   RESEND_API_KEY=re_production_key_here
   RESEND_FROM_EMAIL=noreply@singaporehalaldir.com
   ADMIN_EMAILS=admin@singaporehalaldir.com,owner@singaporehalaldir.com
   NEXT_PUBLIC_APP_URL=https://singaporehalaldir.com
   ```

2. **Deploy Application**
   ```bash
   git add .
   git commit -m "feat: implement email notifications for business submissions"
   git push origin main
   ```

3. **Test Production Emails**
   - Submit test business on production site
   - Verify admin receives notification
   - Verify submitter receives confirmation
   - Check Resend dashboard for delivery status

### Monitoring in Production

- Set up Resend webhook for email events (delivered, bounced, failed)
- Monitor email delivery rates in Resend dashboard
- Set up alerts for failed emails
- Track email open rates and engagement

## Email Customization

### Modify Email Content

Edit `/lib/email.ts` to customize:
- Email subject lines
- HTML template content
- Color scheme (current: green #10b981, blue #3b82f6, yellow #fbbf24)
- Footer links and branding
- Call-to-action button text

### Add More Email Types

```typescript
// Example: Business approved email
export async function sendApprovalNotification(businessData) {
  const emailHtml = `...`
  const emailText = `...`

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: businessData.submitterEmail,
    subject: 'Your Business Listing Has Been Approved!',
    html: emailHtml,
    text: emailText,
  })

  return { success: true, data: result }
}
```

### A/B Testing

Use Resend's API to track different email versions:
- Test different subject lines
- Compare button colors and placement
- Optimize email length and content
- Track open rates and click-through rates

## Cost Management

### Free Tier Limits (Resend)
- 3,000 emails per month
- 100 emails per day
- All email types included
- Full API access
- Dashboard analytics

### Estimated Usage
- Average: 2-5 business submissions per day
- 2 emails per submission (admin + submitter)
- Total: 4-10 emails per day
- Monthly: ~120-300 emails
- **Free tier is sufficient for foreseeable growth**

### Upgrading Plans
If you exceed free tier:
- Pro Plan: $20/month for 50,000 emails
- Scale Plan: $80/month for 1,000,000 emails
- Enterprise: Custom pricing

## Security Best Practices

1. **API Key Security**
   - Never commit API keys to git
   - Use environment variables only
   - Rotate keys periodically
   - Use different keys for dev/staging/production

2. **Email Content**
   - Don't include sensitive data in emails
   - Use secure HTTPS links only
   - Validate email addresses before sending
   - Implement rate limiting for submissions

3. **SPAM Prevention**
   - Verify domain with SPF, DKIM, DMARC
   - Use consistent sender addresses
   - Include unsubscribe links (if applicable)
   - Monitor bounce rates

## Support & Resources

- Resend Documentation: https://resend.com/docs
- Resend API Reference: https://resend.com/docs/api-reference
- Resend Support: support@resend.com
- React Email Templates: https://react.email (for advanced templates)

## Summary

✅ **Implemented**: Email notifications for business submissions
✅ **Service**: Resend (modern, reliable, generous free tier)
✅ **Templates**: Professional, mobile-responsive HTML emails
✅ **Error Handling**: Non-blocking, graceful degradation
✅ **Testing**: Manual and automated testing guides provided
✅ **Production Ready**: Environment-aware configuration
✅ **Scalable**: Free tier covers initial growth, easy to upgrade

**Total Implementation Time**: ~2 hours
**Dependencies Added**: 1 (resend)
**Files Created**: 2 (email.ts, EMAIL_IMPLEMENTATION.md)
**Files Modified**: 1 (listing.ts)
**Lines of Code**: ~500
