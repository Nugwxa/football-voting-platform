'use server'
import { endSession, readSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

/**
 * Logs out the current user by ending their session.
 *
 * @param {string} pathname - The path to revalidate after logout.
 */
export default async function logoutUser(pathname: string): Promise<void> {
  // Retrieve the current session
  const session = await readSession()

  // If no session is found, revalidate the path to show the logged-out state
  if (!session) {
    revalidatePath(pathname)
    return
  }

  try {
    // End the current session
    await endSession()

    // Revalidate the path to ensure the changes are reflected
    revalidatePath(pathname)
  } catch (e) {
    // Log the error based on its type
    if (e instanceof Error) {
      console.error(`Logout process failed: ${e.message}`)
    } else {
      console.error('Unknown error occurred during logout process:', e)
    }
  }
}
