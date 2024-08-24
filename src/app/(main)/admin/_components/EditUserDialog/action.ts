'use server'

import { revalidatePath } from 'next/cache'
import { updateUser, UpdateUserDTO } from '@/lib/user'

/**
 * Handles the edit user form submission.
 *
 * @param {string} userID - The ID of the user being updated.
 * @param {any} prevState - The previous state of the form.
 * @param {FormData} formData - The form data submitted by the user.
 */
export async function handleUserEditForm(
  userID: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  // Extract form data fields
  const name = formData.get('name')?.toString()
  const email = formData.get('email')?.toString()
  const isAdmin = formData.get('isAdmin')?.toString()
  const isActive = formData.get('isActive')?.toString()

  // Validate required fields
  if (!name || !email) {
    return {
      type: 'error',
      message: 'Invalid submission',
    }
  }

  const updatedUser: UpdateUserDTO = {
    id: userID,
    name,
    email,
    isActive: isActive ? true : false,
    isAdmin: isAdmin ? true : false,
  }

  // Attempt to update the user in the database
  const updateUserResponse = await updateUser(updatedUser)

  // Handle potential error from the update operation
  if (updateUserResponse.type === 'error') {
    return {
      type: 'error',
      message: updateUserResponse.message,
    }
  }

  // Revalidate the admin path to reflect changes
  revalidatePath('/admin')

  // Revalidate the admin path to reflect changes
  return {
    type: 'success',
    message: 'User updated!',
  }
}