'use server'
import { getUser } from './'
import { UpdateUserDTO } from './types'
import prisma from '@lib/prisma'

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
    console.error(
      `User update database error: ${e instanceof Error ? e.message : e}`
    )
    return { type: 'error', message: 'Error updating user' }
  }
}
