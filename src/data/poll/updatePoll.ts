'use server'
import { deleteImage } from '@/data/imgur'
import { getPlayer } from '@/data/player'
import { getPoll } from './getPoll'
import { Prisma } from '@prisma/client'
import { UpdatePollDTO } from './types'
import prisma from '@/lib/prisma'

/**
 * Updates a poll's data.
 * @param {UpdatePollDTO} updatedPollData - The data to update the poll with.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */
export async function updatePoll(
  updatedPollData: Readonly<UpdatePollDTO>
): Promise<ActionResponse> {
  const { id, title, description, closesOn, playerIDs, img } = updatedPollData

  if (playerIDs.length < 1) {
    return { type: 'error', message: 'No user in poll' }
  }

  // Validate player IDs
  for (const playerId of playerIDs) {
    const player = await getPlayer({ playerId })
    if (!player) {
      return { type: 'error', message: `Invalid player ID: ${playerId}` }
    }
  }

  const existingPoll = await getPoll({ pollId: id })

  if (!existingPoll) {
    return { type: 'error', message: 'Invalid poll' }
  }

  let imgData: string | Prisma.NullTypes.JsonNull | undefined
  if (img) {
    imgData = JSON.stringify(img) // Convert to JSON string if img is an object
  } else if (img === null) {
    imgData = Prisma.JsonNull // Use Prisma.JsonNull to set the field to null
  } else {
    imgData = undefined // Don't include img in the update if it is undefined
  }

  try {
    await prisma.$transaction([
      prisma.poll.update({
        where: { id: id },
        data: {
          players: {
            set: [],
          },
        },
      }),
      prisma.poll.update({
        where: { id: id },
        data: {
          title,
          description,
          closingDate: closesOn,
          img: imgData,
          players: {
            set: playerIDs.map((playerID) => ({ id: playerID })),
          },
        },
      }),
    ])

    // Delete previous cover image if one was provided
    if (existingPoll.img) {
      deleteImage(existingPoll.img.deleteHash)
    }
    return { type: 'success', message: 'Poll updated!' }
  } catch (e) {
    console.error(
      `Poll update database error: ${e instanceof Error ? e.message : e}`
    )
    return { type: 'error', message: 'Error updating poll' }
  }
}
