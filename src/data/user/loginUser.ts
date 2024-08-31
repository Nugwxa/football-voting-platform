'use server'
import { getUser } from './getUser'
import { LoginUserDTO } from './types'
import supabase from '@/lib/supabaseClient'

/**
 * Logs in a user by email and password.
 *
 * This function first checks if the user exists and if their account is active.
 * If these checks pass, it attempts to sign in using Supabase's authentication.
 *
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 */
export async function loginUser(
  props: Readonly<LoginUserDTO>
): Promise<ActionResponse> {
  const { email, password } = props

  // Check if the user exists
  const existingUser = await getUser({ userEmail: email })

  if (!existingUser) {
    return {
      type: 'error',
      message: 'No account found with the provided email address.',
    }
  }

  // User account is not active
  if (!existingUser.isActive) {
    return {
      type: 'error',
      message:
        'Your account has been disabled. Please contact support for assistance.',
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error during sign-in attempt:', error.message)
    return { type: 'error', message: error.message }
  }

  return {
    type: 'success',
    message: 'Login successful',
  }
}
