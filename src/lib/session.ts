'use server'
import { revalidatePath } from 'next/cache'
import prisma from './prisma'
import supabaseServer from './supabase/supabaseServer'

/**
 *Reads the current user session and retrieves user details if the session is valid.
 */
export async function readSession() {
  try {
    const supabase = supabaseServer()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      if (error.message !== 'Auth session missing!') {
        console.error('Error retrieving session:', error.message)
      }
      return null
    }

    if (!user) {
      console.error('No user from session')
      return null
    }

    const sessionUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!sessionUser || !sessionUser.isActive) return null
    return {
      user: {
        id: user.id,
        name: sessionUser.name,
        email: sessionUser.email,
        isAdmin: sessionUser.isAdmin,
      },
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Session database error: ${e.message}`)
    } else {
      console.error('Unknown session database error:', e)
    }
    return null
  }
}

/**
 * Ends the current user session and optionally revalidates to a specified path.
 *
 * @param {string} path - Optional path to revalidate after sign-out.
 */
export async function endSession(path?: string) {
  try {
    const supabase = supabaseServer()

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error during sign-out:', error.message)
      return
    }
    if (path) {
      revalidatePath(path)
    }
  } catch (error) {
    console.error('Unexpected error during sign-out process:', error)
  }
}
