'use server'

import { readSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { updatePlayer, UpdatePlayerDTO } from '@/lib/player'
import { deleteImage, uploadImage } from '@/lib/imgur'
import { isValidPosition } from '../../../data'
/**
 * Handles the edit player form submission.
 *
 * @param {string} playerID - The ID of the player being updated.
 * @param {any} prevState - The previous state of the form.
 * @param {FormData} formData - The form data submitted by the player.
 */
export async function handlePlayerEditForm(
  playerID: string,
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
  const firstName = formData.get('firstName')?.toString()
  const lastName = formData.get('lastName')?.toString()
  const key = formData.get('key')?.toString()
  const isActive = formData.get('isActive')?.toString()
  const position = formData.get('position')?.toString()
  const squadNumberString = formData.get('squadNumber')?.toString()
  const squadNumber = squadNumberString ? parseInt(squadNumberString, 10) : null
  const isUpdatingImage = formData.get('isUpdatingImage')?.toString()
  const playerImage = formData.get('playerImage') as File | null

  // Validate required fields
  if (!firstName) {
    return {
      type: 'error',
      message: 'First name is required.',
    }
  }

  if (!lastName) {
    return {
      type: 'error',
      message: 'Last name is required.',
    }
  }

  if (!key) {
    return {
      type: 'error',
      message: 'Key is required.',
    }
  }

  if (isActive && !squadNumber) {
    return {
      type: 'error',
      message: 'Squad number is required when the player is active.',
    }
  }

  if (isUpdatingImage && playerImage && playerImage.type !== 'image/png') {
    return {
      type: 'error',
      message: 'Player image must be a PNG file.',
    }
  }

  if (!position || !isValidPosition(position)) {
    return {
      type: 'error',
      message: 'Invalid position.',
    }
  }

  let imageToUse = undefined

  if (isUpdatingImage && playerImage) {
    const res = await uploadImage(
      playerImage,
      `${firstName + ' '}${lastName}'s Photo`
    )
    if (!res)
      return {
        type: 'error',
        message: 'An error occurred while uploading the image',
      }

    imageToUse = res
  }

  const updatedPlayer: UpdatePlayerDTO = {
    id: playerID,
    firstName,
    lastName,
    isActive: isActive ? true : false,
    squadNumber,
    key,
    position: position,
    img: imageToUse,
  }

  // Attempt to update the player in the database
  const updatePlayerResponse = await updatePlayer(updatedPlayer)

  // Handle potential error from the update operation
  if (updatePlayerResponse.type === 'error') {
    // Delete uploaded image
    if (imageToUse) {
      deleteImage(imageToUse.deleteHash)
    }

    return {
      type: 'error',
      message: updatePlayerResponse.message,
    }
  }

  // Revalidate the admin path to reflect changes
  revalidatePath('/admin/players')
  return {
    type: 'success',
    message: 'Player updated!',
  }
}
