'use server'

import { deleteImage, uploadImage } from '@/lib/imgur'
import { readSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { updatePoll, UpdatePollDTO } from '@/lib/poll'
/**
 * Handles the edit poll form submission.
 *
 * @param {string} playerID - The ID of the poll being updated.
 * @param {any} prevState - The previous state of the form.
 * @param {FormData} formData - The form data submitted
 */
export async function handlePollEditForm(
  pollID: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const session = await readSession()

  if (!session || !session.user.isAdmin) {
    return {
      type: 'error',
      message: 'Invalid session',
    }
  }

  // Extract form data fields
  const title = formData.get('title')?.toString()
  const description = formData.get('description')?.toString()
  const closingDateString = formData.get('closingDate')?.toString()
  const playerIDs = formData.getAll('players').map((id) => String(id))
  const isUpdatingImage = formData.get('isUpdatingCover')?.toString()
  const coverImage = formData.get('coverImage') as File | null

  // Validate required fields
  if (!title) {
    return {
      type: 'error',
      message: 'A title is required.',
    }
  }

  if (!description) {
    return {
      type: 'error',
      message: 'A description is required.',
    }
  }

  if (!closingDateString) {
    return {
      type: 'error',
      message: 'A closing date is required.',
    }
  }

  if (
    isUpdatingImage &&
    coverImage &&
    coverImage.size > 0 &&
    coverImage.type !== 'image/png' &&
    coverImage.type !== 'image/jpeg'
  ) {
    return {
      type: 'error',
      message: 'Cover image must be a PNG or JPEG file.',
    }
  }

  let imageToUse = undefined

  if (isUpdatingImage) {
    if (isUpdatingImage && coverImage && coverImage.size > 0) {
      const res = await uploadImage(coverImage, `${title} (Poll)`)
      if (!res)
        return {
          type: 'error',
          message: 'An error occurred while uploading the image',
        }

      imageToUse = res
    } else {
      imageToUse = null
    }
  }

  const updatedPoll: UpdatePollDTO = {
    id: pollID,
    title,
    description,
    closesOn: new Date(closingDateString),
    img: imageToUse,
    playerIDs: playerIDs,
  }

  // Attempt to update the poll in the database
  const updatePollResponse = await updatePoll(updatedPoll)

  // Handle potential error from the update operation
  if (updatePollResponse.type === 'error') {
    // Delete uploaded image
    if (imageToUse) {
      deleteImage(imageToUse.deleteHash)
    }

    return {
      type: 'error',
      message: updatePollResponse.message,
    }
  }

  // Revalidate the admin path to reflect changes
  revalidatePath('/admin/polls')
  return {
    type: 'success',
    message: 'Poll updated!',
  }
}
