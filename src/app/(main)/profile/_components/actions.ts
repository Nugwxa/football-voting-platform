'use server'
import { endSession, readSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { updateUser } from '@/data/user'
import { UpdateUserDTO } from '@/data/user/types'

export async function handleProfileUpdateForm(
  userID: string,
  isAdmin: boolean,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const session = await readSession()

  if (!session) {
    return {
      type: 'error',
      message: 'Invalid session',
    }
  }

  // Extract form data fields
  const name = formData.get('name')?.toString()
  const email = formData.get('email')?.toString()

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
    isActive: true,
    isAdmin,
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
  // Revalidate the profile path to reflect changes
  revalidatePath('/profile')

  return {
    type: 'success',
    message: 'Profile updated!',
  }
}

export async function handleLogoutUser() {
  const session = await readSession()

  if (!session) {
    revalidatePath('/profile')
    return
  }

  await endSession('/profile')

  redirect('/')
}
