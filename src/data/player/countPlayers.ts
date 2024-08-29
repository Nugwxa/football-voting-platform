'use server'

import prisma from '@/lib/prisma'

/**
 * Counts the number of players whose names contain the given query string.
 * @param {string} query - The query string to search for in player names.
 * @returns {Promise<number>} - The number of players matching the query, or -1 if an error occurs.
 */
export async function countPlayers(query: string = ''): Promise<number> {
  let playerCount = 0

  try {
    playerCount = await prisma.player.count({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
        ],
      },
    })
  } catch (e) {
    console.error(
      `Player count database error: ${e instanceof Error ? e.message : e}`
    )
    return -1
  }

  return playerCount
}
