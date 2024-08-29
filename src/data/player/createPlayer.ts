'use server'
import { CreatePlayerDTO } from './types'
import { getPlayer } from '@/data/player'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

/**
 * Creates a new player
 * @param {CreatePlayerDTO} newPlayer - The data of the new player to be created.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */
export async function createPlayer(
  newPlayer: Readonly<CreatePlayerDTO>
): Promise<ActionResponse> {
  const { key, firstName, lastName, squadNumber, position, img, isActive } =
    newPlayer

  // Check if a player with the same key already exists
  const playerWithSameKey = await getPlayer({ playerKey: key })

  if (playerWithSameKey) {
    return {
      type: 'error',
      message: `Key already in use by ${playerWithSameKey.firstName + ' '}${
        playerWithSameKey.lastName
      }`,
    }
  }

  // Prepare img data for insertion into the database
  // Convert to JSON string if img is an object
  // else, use Prisma.JsonNull to set the field to null
  const imgData: string | Prisma.NullTypes.JsonNull = img
    ? JSON.stringify(img)
    : Prisma.JsonNull

  try {
    // Create a new player record in the database
    await prisma.player.create({
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
    return { type: 'success', message: 'Player created!' }
  } catch (e) {
    console.error(
      `Player create database error: ${e instanceof Error ? e.message : e}`
    )
    return { type: 'error', message: 'Error creating player' }
  }
}
