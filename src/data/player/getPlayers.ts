'use server'
import { PlayerDTO } from '@/data/player/types'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

type GetPlayersProps = {
  query?: string
  sortKey?: string
  page?: number
  perPage?: number
  isPaginated?: boolean
}

/**
 * Retrieves a list of players based on the provided search criteria.
 * @param {string} query - The search query to filter players by first name or last name.
 * @param {string} sortKey - The key used to sort the players.
 * @param {number} page - The page number for pagination. Defaults to 1.
 * @param {number} perPage - The number of players to retrieve per page. Defaults to 10.
 * @param {boolean} isPaginated - Whether to paginate the results. Defaults to true.
 * @returns {Promise<PlayerDTO[]>} - A list of players matching the criteria.
 */
export async function getPlayers(
  props: Readonly<GetPlayersProps>
): Promise<PlayerDTO[]> {
  const {
    query = '',
    sortKey,
    page = 1,
    perPage = 10,
    isPaginated = true,
  } = props

  const validPage = page > 0 ? page : 1
  // Calculate the number of players to skip for pagination
  const skip = (validPage - 1) * perPage

  try {
    const orderMap: Record<string, Prisma.PlayerOrderByWithRelationInput[]> = {
      'name-az': [{ firstName: 'asc' }, { lastName: 'asc' }],
      'name-za': [{ firstName: 'desc' }, { lastName: 'desc' }],
      'position-az': [{ position: 'asc' }],
      'position-za': [{ position: 'desc' }],
    }

    // Fetch players from Prisma
    const players = await prisma.player.findMany({
      where: {
        OR: [
          {
            AND: [
              { firstName: { contains: query.split(' ')[0] } },
              { lastName: { contains: query.split(' ')[1] || '' } },
            ],
          },
          {
            AND: [
              { firstName: { contains: query.split(' ')[1] || '' } },
              { lastName: { contains: query.split(' ')[0] } },
            ],
          },
        ],
      },
      skip: isPaginated ? skip : undefined,
      take: isPaginated ? perPage : undefined,
      orderBy: orderMap[sortKey ?? 'name-az'] || orderMap['name-az'],
    })

    const playerDTOs: PlayerDTO[] = players.map((player) => ({
      id: player.id,
      key: player.key,
      firstName: player.firstName,
      lastName: player.lastName,
      img: player.img
        ? (JSON.parse(player.img.toString()) as UploadedImage)
        : null,
      squadNumber: player.squadNumber,
      position: player.position,
      isActive: player.isActive,
    }))

    return playerDTOs
  } catch (e) {
    console.error(
      `Player fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return []
  }
}
