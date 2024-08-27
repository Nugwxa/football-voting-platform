'use server'

import { createPlayer } from '@/lib/player'
import { deleteImage, uploadImage } from '@/lib/imgur'
import { isValidPosition } from '@admin/data'
import { readSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
/**
 * Handles the edit player form submission.
 *
 * @param {string} playerID - The ID of the player being updated.
 * @param {any} prevState - The previous state of the form.
 * @param {FormData} formData - The form data submitted by the player.
 */
export async function handlePlayerCreateForm(
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
  const isAddingImage = formData.get('isAddingImage')?.toString()
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

  if (
    isAddingImage &&
    playerImage &&
    playerImage.size > 0 &&
    playerImage.type !== 'image/png'
  ) {
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

  let imageToUse = null

  if (isAddingImage && playerImage && playerImage.size > 0) {
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
  } else {
    return {
      type: 'error',
      message: 'Player image is required',
    }
  }

  const player = {
    firstName,
    lastName,
    isActive: isActive ? true : false,
    squadNumber,
    key,
    position: position,
    img: imageToUse,
  }

  // Attempt to create the player in the database
  const playerResponse = await createPlayer(player)

  // Handle potential error from the update operation
  if (playerResponse.type === 'error') {
    // Delete uploaded image
    if (imageToUse) {
      deleteImage(imageToUse.deleteHash)
    }

    return {
      type: 'error',
      message: playerResponse.message,
    }
  }

  // Revalidate the admin path to reflect changes
  revalidatePath('/admin/players/new')
  return {
    type: 'success',
    message: 'Player Created!',
  }
}
