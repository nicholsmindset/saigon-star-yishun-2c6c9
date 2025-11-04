/**
 * Email Notification Test Script
 *
 * This script allows you to test email sending without submitting a full business form.
 *
 * Usage:
 * 1. Ensure RESEND_API_KEY is set in .env.local
 * 2. Run: npx tsx tests/email-test.ts
 *
 * Requirements:
 * - Install tsx: npm install -D tsx
 */

import { sendAdminNotification, sendSubmitterConfirmation } from '../lib/email'

async function testEmails() {
  console.log('🧪 Testing Email Notifications...\n')

  // Test data
  const testData = {
    businessName: 'Test Halal Restaurant',
    businessType: 'Restaurant',
    areaName: 'Marina Bay',
    submitterName: 'John Doe',
    submitterEmail: 'test@example.com', // Replace with your email to receive test
    halalCertNumber: 'MUIS-HAL-TEST-001',
    address: '1 Marina Boulevard, Singapore',
    submittedAt: new Date().toISOString(),
  }

  console.log('📧 Sending Admin Notification...')
  const adminResult = await sendAdminNotification(testData)

  if (adminResult.success) {
    console.log('✅ Admin notification sent successfully')
    console.log('   Email ID:', adminResult.data?.id)
  } else {
    console.log('❌ Admin notification failed')
    console.error('   Error:', adminResult.error)
  }

  console.log('\n📧 Sending Submitter Confirmation...')
  const submitterResult = await sendSubmitterConfirmation(testData)

  if (submitterResult.success) {
    console.log('✅ Submitter confirmation sent successfully')
    console.log('   Email ID:', submitterResult.data?.id)
  } else {
    console.log('❌ Submitter confirmation failed')
    console.error('   Error:', submitterResult.error)
  }

  console.log('\n✅ Email test complete!')
  console.log('📊 Results:')
  console.log(`   Admin Email: ${adminResult.success ? 'SENT' : 'FAILED'}`)
  console.log(`   Submitter Email: ${submitterResult.success ? 'SENT' : 'FAILED'}`)
}

// Run tests
testEmails().catch((error) => {
  console.error('❌ Test script error:', error)
  process.exit(1)
})
