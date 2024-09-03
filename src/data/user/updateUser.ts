'use server'
import { getUser } from './'
import { UpdateUserDTO } from './types'
import prisma from '@lib/prisma'
import supabaseAdmin from '@/lib/supabase/supabaseAdmin'

/**
 * Updates a user’s information.
 * @param {UpdateUserDTO} updatedUserData - The data to update the user with.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */
export async function updateUser(
  updatedUserData: Readonly<UpdateUserDTO>
): Promise<ActionResponse> {
  const { id, email, name, isActive, isAdmin } = updatedUserData

  const [existingUser, userWithSameEmail] = await Promise.all([
    getUser({ userId: id }),
    email ? getUser({ userEmail: email }) : null,
  ])

  if (!existingUser) {
    return { type: 'error', message: 'Invalid user' }
  }

  if (userWithSameEmail && userWithSameEmail.id !== id) {
    return { type: 'error', message: 'Email already in use' }
  }

  let updatedSupabaseEmail = false

  // If the email has changed, attempt to update it in Supabase first
  if (existingUser.email !== email) {
    const supabase = supabaseAdmin()
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      email: email,
    })

    if (error) {
      console.error('Error updating user email in Supabase:', error.message)
      return {
        type: 'error',
        message: `Error updating email: ${error.message}`,
      }
    }

    updatedSupabaseEmail = true
  }

  // Attempt to update the user in the database
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        name: name,
        isActive: isActive,
        isAdmin: isAdmin,
      },
    })
    return { type: 'success', message: 'User updated!' }
  } catch (e) {
    // If user table update fails and the user's Supabase email has been updated, revert it
    if (updatedSupabaseEmail) {
      const supabase = supabaseAdmin()
      const revert = await supabase.auth.admin.updateUserById(id, {
        email: existingUser.email, // revert to the original email
      })

      if (revert.error) {
        console.error(
          'Failed to revert Supabase email change after database error:',
          revert.error.message
        )

        // Possibly send an email to admins notifying them of this error so it can be fixed
        return {
          type: 'error',
          message:
            'Critical error: Failed to update database and revert email change, ',
        }
      }
    }

    console.error(
      `User update database error: ${e instanceof Error ? e.message : e}`
    )
    return { type: 'error', message: `Error updating user: ${e}` }
  }
}
