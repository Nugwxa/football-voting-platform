'use server'
import { cookies } from 'next/headers'
import prisma from '@lib/prisma'

export async function readSession() {
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

/**
 * Invalidates the user's session by setting its expiry date in the past.
 */
export async function endSession() {
  // Retrieve the user's session
  const session = await readSession()

  // If no session is found, exit the function early.
  if (!session) {
    return
  }

  // Create a new Date object representing the current date and time
  // and modify the date to be 7 days in the past.
  const now = new Date()

  now.setDate(now.getDate() - 7)

  try {
    // Update the session in the database, setting its expiryDate to 7 days ago.
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiryDate: now,
      },
    })
  } catch (e) {
    // If an error occurs during the session update, log it to the console.
    // Handle the error based on its type.
    if (e instanceof Error) {
      console.error(
        `Session deletion failed for session ID ${session.id}: ${e.message}`
      )
    } else {
      console.error(`Session deletion failed for session ID ${session.id}`, e)
    }
  }
}
