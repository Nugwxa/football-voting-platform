'use server'
import { $Enums } from '@prisma/client'
import { PlayerDTO } from './types'
import prisma from '@/lib/prisma'

type GetPlayerProps = {
  playerId?: string
  playerKey?: string
}

/**
 * Retrieves a single player based on the provided ID or key.
 * @param {string} playerId - The ID of the player to retrieve.
 * @param {string} playerKey - The key of the player to retrieve.
 * @returns {Promise<PlayerDTO | null>} - The player matching the criteria, or null if not found.
 */
export async function getPlayer(
  props: Readonly<GetPlayerProps>
): Promise<PlayerDTO | null> {
  const { playerId, playerKey } = props
  if (!playerId && !playerKey) {
    console.error("Either 'playerId' or 'playerKey' must be provided.")
    return null
  }

  try {
    const player = await prisma.player.findUnique({
      where: {
        id: playerId || undefined,
        key: playerKey || undefined,
      },
    })

    if (!player) return null

    const playerDTO: PlayerDTO = {
      id: player.id,
      key: player.key,
      firstName: player.firstName,
      lastName: player.lastName,
      img: player.img
        ? (JSON.parse(player.img.toString()) as UploadedImage)
        : null,
      squadNumber: player.squadNumber,
      position: player.position as $Enums.PlayerPositions, // Assuming position is an enum
      isActive: player.isActive,
    }

    return playerDTO
  } catch (e) {
    console.error(
      `Player fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return null
  }
}
