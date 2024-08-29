'use server'
import { deleteImage } from '@/data/imgur'
import { getPlayer } from '@/data/player'
import { Prisma } from '@prisma/client'
import { UpdatePlayerDTO } from './types'
import prisma from '@/lib/prisma'

/**
 * Updates a player’s information.
 * @param {UpdatePlayerDTO} updatedPlayerData - The data to update the player with.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */
export async function updatePlayer(
  updatedPlayerData: Readonly<UpdatePlayerDTO>
): Promise<ActionResponse> {
  const { id, key, firstName, lastName, squadNumber, position, img, isActive } =
    updatedPlayerData

  const [existingPlayer, playerWithSameKey] = await Promise.all([
    getPlayer({ playerId: id }),
    key ? getPlayer({ playerKey: key }) : null,
  ])

  if (!existingPlayer) {
    return { type: 'error', message: 'Invalid player' }
  }

  if (playerWithSameKey && playerWithSameKey.id !== id) {
    return {
      type: 'error',
      message: `Key already in use by ${playerWithSameKey.firstName + ' '}${
        playerWithSameKey.lastName
      }`,
    }
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
    await prisma.player.update({
      where: {
        id: id,
      },
      data: {
        key: key,
        firstName: firstName,
        lastName: lastName,
        isActive: isActive,
        squadNumber: squadNumber,
        position: position,
        img: imgData,
      },
    })
    if (existingPlayer.img) {
      deleteImage(existingPlayer.img.deleteHash)
    }
    return { type: 'success', message: 'Player updated!' }
  } catch (e) {
    console.error(
      `Player update database error: ${e instanceof Error ? e.message : e}`
    )
    return { type: 'error', message: 'Error updating player' }
  }
}
