import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender email from environment
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@singaporehalaldir.com'

// Admin email(s) from environment
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || ['admin@singaporehalaldir.com']

// App URL for links
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export interface BusinessSubmissionData {
  businessName: string
  businessType: string
  areaName: string
  submitterName: string
  submitterEmail: string
  halalCertNumber: string
  address: string
  submittedAt: string
}

/**
 * Send email notification to admin about new business submission
 */
export async function sendAdminNotification(data: BusinessSubmissionData) {
  try {
    const { businessName, businessType, areaName, submitterEmail, halalCertNumber, address, submittedAt } = data

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .alert {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .alert-text {
              margin: 0;
              color: #92400e;
              font-weight: 600;
            }
            .info-grid {
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              padding: 12px;
              border-bottom: 1px solid #f3f4f6;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-weight: 600;
              color: #6b7280;
              min-width: 150px;
            }
            .info-value {
              color: #111827;
              flex: 1;
            }
            .button {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
              text-align: center;
            }
            .button:hover {
              background: #059669;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
              margin-top: 30px;
            }
            @media (max-width: 600px) {
              .info-row {
                flex-direction: column;
              }
              .info-label {
                margin-bottom: 4px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔔 New Business Submission</h1>
          </div>

          <div class="content">
            <div class="alert">
              <p class="alert-text">⏰ Action Required: A new business listing awaits your review</p>
            </div>

            <p>Hello Admin,</p>

            <p>A new halal business has been submitted to the Singapore Halal Directory and is pending your approval.</p>

            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">Business Name:</div>
                <div class="info-value"><strong>${businessName}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">Business Type:</div>
                <div class="info-value">${businessType}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Area:</div>
                <div class="info-value">${areaName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Address:</div>
                <div class="info-value">${address}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Halal Cert #:</div>
                <div class="info-value">${halalCertNumber}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Submitted By:</div>
                <div class="info-value">${submitterEmail}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Submission Date:</div>
                <div class="info-value">${new Date(submittedAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Status:</div>
                <div class="info-value"><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">PENDING APPROVAL</span></div>
              </div>
            </div>

            <center>
              <a href="${APP_URL}/admin/businesses" class="button">
                Review Submission →
              </a>
            </center>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <strong>Next Steps:</strong><br>
              1. Verify the halal certification details<br>
              2. Review business information for accuracy<br>
              3. Approve or reject the submission<br>
              4. The submitter will be notified of your decision
            </p>
          </div>

          <div class="footer">
            <p>Singapore Halal Directory - Admin Portal</p>
            <p style="font-size: 12px;">This is an automated notification. Do not reply to this email.</p>
          </div>
        </body>
      </html>
    `

    const emailText = `
New Business Submission - Action Required

Business Name: ${businessName}
Business Type: ${businessType}
Area: ${areaName}
Address: ${address}
Halal Cert #: ${halalCertNumber}
Submitted By: ${submitterEmail}
Submission Date: ${new Date(submittedAt).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}
Status: PENDING APPROVAL

Review this submission: ${APP_URL}/admin/businesses

Next Steps:
1. Verify the halal certification details
2. Review business information for accuracy
3. Approve or reject the submission
4. The submitter will be notified of your decision

---
Singapore Halal Directory - Admin Portal
This is an automated notification.
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `New Business Submission: ${businessName}`,
      html: emailHtml,
      text: emailText,
    })

    console.log('Admin notification sent successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send admin notification:', error)
    return { success: false, error }
  }
}

/**
 * Send confirmation email to business submitter
 */
export async function sendSubmitterConfirmation(data: BusinessSubmissionData) {
  try {
    const { businessName, businessType, areaName, submitterName } = data

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .success-badge {
              background: #d1fae5;
              border: 2px solid #10b981;
              color: #065f46;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .success-badge h2 {
              margin: 0 0 10px 0;
              font-size: 20px;
            }
            .success-badge p {
              margin: 0;
              font-size: 14px;
            }
            .info-box {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-box h3 {
              margin: 0 0 12px 0;
              font-size: 16px;
              color: #111827;
            }
            .info-box p {
              margin: 8px 0;
              color: #4b5563;
            }
            .timeline {
              margin: 30px 0;
            }
            .timeline-item {
              display: flex;
              margin: 20px 0;
              position: relative;
            }
            .timeline-icon {
              width: 40px;
              height: 40px;
              background: #10b981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              flex-shrink: 0;
              margin-right: 15px;
            }
            .timeline-content {
              flex: 1;
              padding-top: 8px;
            }
            .timeline-content h4 {
              margin: 0 0 5px 0;
              font-size: 16px;
              color: #111827;
            }
            .timeline-content p {
              margin: 0;
              color: #6b7280;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background: #059669;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
              border-top: 1px solid #e5e7eb;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Submission Received</h1>
          </div>

          <div class="content">
            <p>Dear ${submitterName},</p>

            <div class="success-badge">
              <h2>Thank you for your submission!</h2>
              <p>We've received your business listing and it's now pending review.</p>
            </div>

            <p>Your submission details:</p>

            <div class="info-box">
              <h3>📋 Business Information</h3>
              <p><strong>Business Name:</strong> ${businessName}</p>
              <p><strong>Business Type:</strong> ${businessType}</p>
              <p><strong>Area:</strong> ${areaName}</p>
            </div>

            <h3 style="margin-top: 30px; color: #111827;">What happens next?</h3>

            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-icon">1</div>
                <div class="timeline-content">
                  <h4>Review Process</h4>
                  <p>Our team will verify your halal certification and business details</p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-icon">2</div>
                <div class="timeline-content">
                  <h4>Approval Decision</h4>
                  <p>We'll review your submission within <strong>48 hours</strong></p>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-icon">3</div>
                <div class="timeline-content">
                  <h4>Go Live</h4>
                  <p>Once approved, your business will appear on our directory</p>
                </div>
              </div>
            </div>

            <div class="info-box" style="background: #eff6ff; border-color: #bfdbfe;">
              <h3 style="color: #1e40af;">💡 Pro Tip</h3>
              <p style="color: #1e3a8a;">Consider upgrading to a <strong>Featured Listing</strong> after approval to get:</p>
              <ul style="margin: 10px 0; padding-left: 20px; color: #1e3a8a;">
                <li>Top placement in search results</li>
                <li>Up to 8 business photos</li>
                <li>Blue "Featured" badge</li>
                <li>Increased visibility to customers</li>
              </ul>
              <p style="color: #1e3a8a; font-size: 12px; margin-top: 10px;">Starting from just $29/month</p>
            </div>

            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              <strong>Questions or concerns?</strong><br>
              Reply to this email or contact us at support@singaporehalaldir.com
            </p>
          </div>

          <div class="footer">
            <p><strong>Singapore Halal Directory</strong></p>
            <p>Your trusted source for halal-certified businesses in Singapore</p>
            <p style="font-size: 12px; margin-top: 15px;">
              <a href="${APP_URL}" style="color: #10b981; text-decoration: none;">Visit Directory</a> |
              <a href="${APP_URL}/about" style="color: #10b981; text-decoration: none;">About Us</a> |
              <a href="${APP_URL}/contact" style="color: #10b981; text-decoration: none;">Contact</a>
            </p>
          </div>
        </body>
      </html>
    `

    const emailText = `
Submission Received - Thank You!

Dear ${submitterName},

Thank you for your submission! We've received your business listing and it's now pending review.

Your submission details:
---
Business Name: ${businessName}
Business Type: ${businessType}
Area: ${areaName}

What happens next?
---
1. Review Process
   Our team will verify your halal certification and business details

2. Approval Decision (within 48 hours)
   We'll review your submission and notify you of our decision

3. Go Live
   Once approved, your business will appear on our directory

PRO TIP: Consider upgrading to a Featured Listing after approval to get:
- Top placement in search results
- Up to 8 business photos
- Blue "Featured" badge
- Increased visibility to customers
Starting from just $29/month

Questions or concerns?
Reply to this email or contact us at support@singaporehalaldir.com

---
Singapore Halal Directory
Your trusted source for halal-certified businesses in Singapore

Visit: ${APP_URL}
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.submitterEmail,
      subject: 'Business Submission Received - Pending Review',
      html: emailHtml,
      text: emailText,
    })

    console.log('Submitter confirmation sent successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send submitter confirmation:', error)
    return { success: false, error }
  }
}
