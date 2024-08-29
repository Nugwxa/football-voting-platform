'use server'
import { CreatePollDTO } from './types'
import { getPlayer } from '@/data/player'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

/**
 * Creates a new poll
 * @param {CreatePollDTO} newPoll - The data of the new poll to be created.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */

export async function createPoll(
  newPoll: Readonly<CreatePollDTO>
): Promise<ActionResponse> {
  const { title, description, closesOn, img, playerIDs } = newPoll

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

  // Prepare img data for insertion into the database
  // Convert to JSON string if img is an object
  // else, use Prisma.JsonNull to set the field to null
  const imgData: string | Prisma.NullTypes.JsonNull = img
    ? JSON.stringify(img)
    : Prisma.JsonNull

  try {
    // Create a new poll record in the database
    await prisma.poll.create({
      data: {
        title,
        description,
        closingDate: closesOn,
        img: imgData,
        players: {
          connect: playerIDs.map((id) => ({ id })),
        },
      },
    })
    return { type: 'success', message: 'Poll created!' }
  } catch (e) {
    console.error(
      `Poll creation database error: ${e instanceof Error ? e.message : e}`
    )
    return { type: 'error', message: 'Error creating poll' }
  }
}
