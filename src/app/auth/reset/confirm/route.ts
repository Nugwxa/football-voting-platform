import { NextResponse } from 'next/server'
import supabaseServer from '@/lib/supabase/supabaseServer'

export async function GET(request: Request) {
  // Extract the query parameters from the request URL
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const redirectUrl = searchParams.get('redirectUrl') || '/auth/reset/confirm' // Fallback redirect URL if none is provided

  const supabase = supabaseServer()

  // Check if token_hash is present
  if (!tokenHash) {
    // If no token is found, redirect to home or an error page
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    // Verify the OTP token using Supabase's verifyOtp method
    const { data, error } = await supabase.auth.verifyOtp({
      type: 'recovery', // Specifies that this is a password recovery verification
      token_hash: tokenHash, // The token extracted from the query parameters
    })

    if (error || !data) {
      console.error('Error verifying OTP: ', error)
      // Redirect to an error page or handle error response
      return NextResponse.redirect(
        new URL('/?error=error-verifying', request.url)
      )
    }

    // If verification is successful, the user is logged in
    // Redirect to the new-password page
    return NextResponse.redirect(
      new URL('/auth/reset/new-password', request.url)
    )
  } catch (error) {
    console.error('Server error during verification: ', error)
    // Handle server errors, potentially redirect to an error page
    return NextResponse.redirect(new URL('/?error=server-error', request.url))
  }
}
