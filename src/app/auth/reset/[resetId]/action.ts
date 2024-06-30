'use server'
import crypto from 'crypto'
import prisma from '@lib/prisma'

export async function resetPassword(
  resetTokenId: string,
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
  const resetToken = await prisma.resetToken.findUnique({
    where: {
      id: resetTokenId,
    },
    select: {
      isUsed: true,
      expiryDate: true,
      user: {
        select: {
          id: true,
          auth: true,
        },
      },
    },
  })
  const now = new Date()
  if (!resetToken || resetToken.isUsed || resetToken.expiryDate < now)
    return {
      type: 'error',
      message: 'Invalid Token',
    }

  const userAuth = JSON.parse(resetToken.user.auth as any) as UserAuthObject

  const passwordHash = crypto
    .pbkdf2Sync(
      password as string,
      `${userAuth.passwordSalt}`,
      10000,
      256 / 8,
      'sha256'
    )
    .toString('base64')
  const authObject = {
    passwordHash: passwordHash,
    passwordSalt: userAuth.passwordSalt,
  }

  try {
    await prisma.resetToken.update({
      where: { id: resetTokenId },
      data: {
        isUsed: true,
      },
    })
  } catch (e: any) {
    return {
      type: 'error',
      message: 'An error occured while reseting password',
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: resetToken.user.id,
      },
      data: {
        auth: JSON.stringify(authObject),
      },
    })
  } catch (e: any) {
    return {
      type: 'error',
      message: 'An error occured while reseting password',
    }
  }
  return {
    type: 'success',
    message: 'Password Changed',
  }
}
