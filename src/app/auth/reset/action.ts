'use server'
import supabaseServer from '@/lib/supabase/supabaseServer'

/**
 * Sends a password reset link to the user's email address.
 *
 * @param {any} prevState - The previous state
 * @param {FormData} formData - The form data containing the user's email address.
 */
export async function sendResetLink(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  // Extract the email from the form data, converting it to a string if present
  const email = formData.get('email')?.toString()

  if (!email)
    return { type: 'error', message: 'Invalid Submission: Email is required.' }

  const supabase = supabaseServer()

  try {
    // Attempt to send a password reset link to the specified email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.HOST_URL}/auth/reset/confirm`,
    })

    // Check if the data is empty
    if (!data) {
      return {
        type: 'error',
        message: 'Unexpected response: Password reset link could not be sent.',
      }
    }

    // Handle any error that occurs during the password reset request
    if (error) console.error('Send password reset link error:', error)
    return {
      type: 'error',
      message: 'Error sending password reset: Please try again later.',
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }

  return {
    type: 'success',
    message: 'Password reset link sent! Please check your email.',
  }
}
