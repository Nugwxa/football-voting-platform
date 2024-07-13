'use server'
import { cookies } from 'next/headers'
import prisma from '@lib/prisma'

export default async function readSession() {
  const cookieName = 'mvp-token'
  const cookie = cookies().get(cookieName)

  //   Check cookie presence
  if (!cookie || cookie.value === '') return null

  //   Search for a session that matches the cookie value
  let session
  try {
    session = await prisma.session.findUnique({
      where: {
        id: cookie.value,
      },
      select: {
        id: true,
        expiryDate: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
          },
        },
      },
    })
  } catch (e: any) {
    console.error(`Database error:`, e.message)
    return null
  }

  const now = new Date()
  // If no session is found or the session has expired, return null
  if (!session || session.expiryDate < now) return null

  //   Return session object
  return {
    id: session.id,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      isAdmin: session.user.isAdmin,
    },
  }
}
