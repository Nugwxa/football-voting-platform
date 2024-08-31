'use server'

import { redirect } from 'next/navigation'
import { loginUser } from '@/data/user'

export async function handleSignInForm(
  redirectTo: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return {
      type: 'error',
      message: 'Invalid submission',
    }
  }

  try {
    const loginResponse = await loginUser({ email, password })

    if (loginResponse.type === 'error') {
      return {
        type: 'error',
        message: loginResponse.message,
      }
    }
  } catch (e: any) {
    console.log('Error: ', e)
    return {
      type: 'error',
      message: 'Error logging in', // Update message later
    }
  }
  redirect(redirectTo)
}
