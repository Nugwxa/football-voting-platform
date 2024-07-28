'use server'
import { cookies } from 'next/headers'
import prisma from '@lib/prisma'

export default async function readSession() {
  const cookieName = 'tally-token'
  const cookie = cookies().get(cookieName)

  // Check if the cookie is present and has a valid value
  if (!cookie?.value) return null

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
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Session database error: ${e.message}`)
    } else {
      console.error('Unknown session database error:', e)
    }
    return null
  }

  const now = new Date()
  // Check if session exists and is not expired
  if (!session || session.expiryDate < now) return null

  // Return session object
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
