'use server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import readSession from '@/lib/session'

export default async function logoutUser(pathname: string) {
  const session = await readSession()

  if (!session) {
    // Revalidate path so they'll see that they're already logged out
    revalidatePath(pathname)
    return
  }

  const now = new Date()

  now.setDate(now.getDate() - 7)
  try {
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiryDate: now,
      },
    })

    // Trigger revalidation of the current path
    revalidatePath(pathname)
  } catch (e: any) {
    console.log(e)
  }
}
