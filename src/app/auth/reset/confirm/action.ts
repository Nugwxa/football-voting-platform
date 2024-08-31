'use server'
import { redirect } from 'next/navigation'
import supabaseServer from '@/lib/supabase/supabaseServer'

/**
 * Handles the password reset process by validating the new password and updating the user password.
 *
 * @param {any} prevState - The previous state
 * @param {FormData} formData - The form data containing the new password and its confirmation.
 */
export async function resetPassword(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  // Extract and validate password and confirm password fields from form data.
  const password = formData.get('new-password')?.toString()
  const confirmPassword = formData.get('confirm-password')?.toString()

  if (!password || !confirmPassword)
    return {
      type: 'error',
      message: 'Invalid Submission',
    }

  if (password.toString().length < 6)
    return {
      type: 'error',
      message: 'Password too short (Minimum is 6 characters)',
    }

  if (password !== confirmPassword)
    return {
      type: 'error',
      message: "Passwords don't match",
    }

  const supabase = supabaseServer()

  try {
    // Attempt to update the user's password in Supabase.
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    })

    // Check if no data is returned, which may indicate an issue.
    if (!data) {
      console.error(
        'Unexpected response: No data received after password reset request.'
      )
      return {
        type: 'error',
        message: 'Error changing password: No response data.',
      }
    }

    // Check for errors in the response.
    if (error) {
      console.error('Password update error:', error) // Log the error for debugging purposes.
      return {
        type: 'error',
        message: 'Error changing password: Please try again later.',
      }
    }
  } catch (error) {
    console.error('Unknkown user password reset error: ', error)

    return {
      type: 'error',
      message: 'Error changing password',
    }
  }

  // Redirect to the homepage after a successful password reset.
  redirect('/')
}
