'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import prisma from '@lib/prisma'

export async function loginUser(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return {
      type: 'error',
      message: 'Invalid submission',
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
    select: {
      id: true,
      auth: true,
    },
  })

  if (!user) {
    return {
      type: 'error',
      message: 'Invalid email or password',
    }
  }

  const userAuth = JSON.parse(user.auth as any) as {
    passwordHash: string
    passwordSalt: string
  }

  const providedPasswordHash = crypto
    .pbkdf2Sync(
      password as string,
      `${userAuth.passwordSalt}`,
      10000,
      256 / 8,
      'sha256'
    )
    .toString('base64')

  if (providedPasswordHash !== userAuth.passwordHash) {
    return {
      type: 'error',
      message: 'Invalid email or password',
    }
  }
  const sessionDuration = 1
  const startDate = new Date()
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + sessionDuration)

  try {
    const userSession = await prisma.session.create({
      data: {
        userId: user.id,
        startDate: startDate,
        expiryDate: expiryDate,
      },
      select: {
        id: true,
      },
    })
    cookies().set('mvp-token', userSession.id, { expires: expiryDate })
  } catch (e: any) {
    console.log('Error: ', e)
    return {
      type: 'error',
      message: 'Error logging in', // Update message later
    }
  }
  redirect('/')
}
