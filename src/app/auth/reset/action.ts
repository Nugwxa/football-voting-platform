'use server'
import prisma from '@lib/prisma'

export async function sendResetLink(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get('email')?.toString()

  if (!email) return { type: 'error', message: 'Invalid Submission' }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  const expiryDate = new Date()
  expiryDate.setHours(expiryDate.getHours() + 2)
  if (user) {
    const resetToken = await prisma.resetToken.create({
      data: {
        userId: user.id,
        expiryDate: expiryDate,
      },
      select: {
        id: true,
      },
    })

    console.log('Reset Token: ', resetToken.id) // Should be replaced with mailing service
  }

  return {
    type: 'success',
    message:
      'Password reset link sent! Please check your email. Note: The link will expire in 2 hours.',
  }
}
