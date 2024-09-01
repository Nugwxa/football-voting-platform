'use server'
import { createUser } from '@/data/user'
import { redirect } from 'next/navigation'

export async function handleRegistrationForm(
  redirectTo: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const name = formData.get('name')?.toString()
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const confirmPassword = formData.get('confirm_password')?.toString()

  if (!name || !email || !password || !confirmPassword) {
    return {
      type: 'error',
      message: 'Invalid submission',
    }
  }

  const isValidName = /^[a-zA-Z\s\.\-]+$/.test(name)

  if (!isValidName) {
    return {
      type: 'error',
      message:
        'Invalid name. Please use only letters, spaces, periods, and hyphens.',
    }
  }
  if (password.toString().length < 6) {
    return {
      type: 'error',
      message: 'Password too short (Minimum is 6 characters)',
    }
  }
  if (password !== confirmPassword) {
    return {
      type: 'error',
      message: "Passwords don't match",
    }
  }

  const response = await createUser({ email, password, name })

  if (response.type === 'error')
    return {
      type: 'error',
      message: response.message,
    }

  redirect(redirectTo)
}
