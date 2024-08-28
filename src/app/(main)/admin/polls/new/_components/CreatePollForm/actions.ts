'use server'

import { getPlayers } from '@/lib/player'
import { deleteImage, uploadImage } from '@/lib/imgur'
import { readSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { createPoll, CreatePollDTO } from '@/lib/poll'
/**
 * Handles the create poll form submission.
 *
 * @param {any} prevState - The previous state of the form.
 * @param {FormData} formData - The form data of the poll.
 */
export async function handlePollCreateForm(
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
  const coverImage = formData.get('playerImage') as File | null

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

  let imageToUse = null

  if (coverImage && coverImage.size > 0) {
    const res = await uploadImage(coverImage, `${title} (Poll)`)
    if (!res)
      return {
        type: 'error',
        message: 'An error occurred while uploading the image',
      }

    imageToUse = res
  }

  const closesOn = new Date(closingDateString)
  const poll: CreatePollDTO = {
    playerIDs,
    title,
    description,
    closesOn,
    img: imageToUse,
  }

  // Attempt to create the poll in the database
  const pollResponse = await createPoll(poll)

  // Handle potential error from the update operation
  if (pollResponse.type === 'error') {
    // Delete uploaded image
    if (imageToUse) {
      deleteImage(imageToUse.deleteHash)
    }

    return {
      type: 'error',
      message: pollResponse.message,
    }
  }

  // Revalidate the admin path to reflect changes
  revalidatePath('/admin/polls/new')
  return {
    type: 'success',
    message: 'Poll Created!',
  }
}

export async function fetchPlayers(inputValue: string) {
  const players = await getPlayers({ query: inputValue, isPaginated: false })
  return players.map((p) => ({
    label: `${p.squadNumber ? '#' + p.squadNumber + ' ' : ''}${
      p.firstName + ' '
    }${p.lastName} [${p.position}]`,
    value: p.id,
  }))
}
