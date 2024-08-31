'use server'
import { redirect } from 'next/navigation'
import supabaseServer from '@/lib/supabase/supabaseServer'

export async function resetPassword(
  redirectTo: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
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
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    })

    if (!data) {
      console.error('User password reset error')
      return {
        type: 'error',
        message: 'Error changing password',
      }
    }

    if (error) {
      console.error('Error From auth: ', error)

      return {
        type: 'error',
        message: `Error changing password: ${error.message}`,
      }
    }
  } catch (error) {
    console.error('Unknkown user password reset error: ', error)

    return {
      type: 'error',
      message: 'Error changing password',
    }
  }

  redirect(redirectTo ?? '/')

  return {
    type: 'success',
    message: 'Password changed',
  }
}
