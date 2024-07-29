'use server'
import crypto from 'crypto'
import prisma from '@lib/prisma'

export async function createUser(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirm_password')

  if (!name || !email || !password || !confirmPassword) {
    return {
      type: 'error',
      message: 'Invalid submission',
    }
  }

  const usersWithSpecifiedEmail = await prisma.user.count({
    where: {
      email: email as string,
    },
  })

  if (usersWithSpecifiedEmail > 0) {
    return {
      type: 'error',
      message: 'Email already in use',
    }
  }

  const isValidName = /^[a-zA-Z\s\.\-]+$/.test(name as string)

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

  //   Generate Salt & Hash The User's Password
  const passwordSalt = crypto.randomBytes(64)
  const passwordHash = crypto
    .pbkdf2Sync(
      password as string,
      passwordSalt.toString('hex'),
      10000,
      256 / 8,
      'sha256'
    )
    .toString('base64')

  const authObject = {
    passwordHash: passwordHash,
    passwordSalt: passwordSalt.toString('hex'),
  }
  const now = new Date()
  try {
    await prisma.user.create({
      data: {
        name: name as string,
        email: email as string,
        auth: JSON.stringify(authObject),
        registrationDate: now,
      },
    })
  } catch (e: any) {
    console.error(e)
    return {
      type: 'error',
      message: 'Error creating account',
    }
  }

  return {
    type: 'success',
    message: 'Account created, you will be redirected to the login page',
  }
}
