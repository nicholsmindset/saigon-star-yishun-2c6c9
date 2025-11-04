import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // If there's an error from Supabase, redirect to login with error message
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  // If there's a code, exchange it for a session
  if (code) {
    const supabase = await createClient()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('Invalid or expired magic link')}`, request.url)
      )
    }

    // Successfully authenticated - redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // No code or error - redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
