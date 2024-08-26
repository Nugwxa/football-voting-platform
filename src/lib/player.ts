'use server'
import { $Enums, Prisma } from '@prisma/client'
import { deleteImage } from './imgur'
import prisma from '@lib/prisma'

export type PlayerDTO = {
  id: string
  key: string
  firstName: string
  lastName: string
  img: UploadedImage | null
  squadNumber: number | null
  position: $Enums.PlayerPositions
  isActive: boolean
}

/**
 * Counts the number of players whose names contain the given query string.
 * @param {string} query - The query string to search for in player names.
 * @returns {Promise<number>} - The number of players matching the query, or -1 if an error occurs.
 */
export async function countPlayers(query = '') {
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

type GetPlayersProps = {
  query?: string
  sortKey?: string
  page?: number
  perPage?: number
}

/**
 * Retrieves a list of players based on the provided search criteria.
 * @returns {Promise<PlayerDTO[]>} - A list of players matching the criteria.
 */
export async function getPlayers(
  props: Readonly<GetPlayersProps>
): Promise<PlayerDTO[]> {
  const { query, sortKey, page = 1, perPage = 10 } = props

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
          { firstName: { contains: query } },
          { lastName: { contains: query } },
        ],
      },
      skip: skip,
      take: perPage,
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

type GetPlayerProps = {
  playerId?: string
  playerKey?: string
}

/**
 * Retrieves a single player based on the provided ID or key.
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

export interface UpdatePlayerDTO extends Omit<PlayerDTO, 'img'> {
  img: UploadedImage | null | undefined
}

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

/**
 * Creates a new player
 * @param {Omit<PlayerDTO, 'id'>} newPlayer - The data of the new player to be created.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */
export async function createPlayer(newPlayer: Omit<PlayerDTO, 'id'>) {
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
  let imgData: string | Prisma.NullTypes.JsonNull
  if (img) {
    // Convert to JSON string if img is an object
    imgData = JSON.stringify(img)
  } else {
    // Use Prisma.JsonNull to set the field to null
    imgData = Prisma.JsonNull
  }

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
