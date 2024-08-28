'use server'
import { deleteImage } from './imgur'
import { getPlayer, PlayerDTO } from './player'
import { Prisma } from '@prisma/client'
import prisma from '@lib/prisma'

export type PollDTO = {
  id: string
  title: string
  description: string
  createdOn: Date
  closesOn: Date
  img: UploadedImage | null
  players: PlayerDTO[]
}

type CountPollsProps = {
  query?: string
  isActive?: boolean
}

/**
 * Counts the number of polls that match the specified conditions.
 * @param {string} query - The query string to search for in the poll's title/description.
 * @param {boolean} isActive - filter flag to count only active polls(not expired)
 * @returns {Promise<number>} - The number of polls matching the query, or -1 if an error occurs.
 */

export async function countPolls(props: Readonly<CountPollsProps>) {
  const { query, isActive } = props
  try {
    const now = new Date()

    const pollCount = await prisma.poll.count({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          },
          {
            // Polls that haven't reached their closing date
            ...(isActive === true && { closingDate: { gt: now } }),

            // Polls that have already passed their closing date
            ...(isActive === false && { closingDate: { lt: now } }),
          },
        ],
      },
    })
    return pollCount
  } catch (e) {
    console.error(
      `Poll count database error: ${e instanceof Error ? e.message : e}`
    )
    return -1
  }
}

type GetPollsProps = {
  query?: string
  sortKey?: string
  page?: number
  perPage?: number
  isActive?: boolean
}

/**
 * Retrieves a list of polls based on the provided search criteria.
 * @returns {Promise<PollDTO[]>} - A list of polls matching the criteria.
 */
export async function getPolls(
  props: Readonly<GetPollsProps>
): Promise<PollDTO[]> {
  const { query, sortKey, page = 1, perPage = 10, isActive } = props

  const validPage = Math.max(page, 1)
  const validPerPage = Math.max(perPage, 1)
  // Calculate the number of polls to skip for pagination
  const skip = (validPage - 1) * validPerPage

  try {
    const orderMap: Record<string, Prisma.PollOrderByWithRelationInput[]> = {
      'title-az': [{ title: 'asc' }],
      'title-za': [{ title: 'desc' }],
      'created-date-new-old': [{ startDate: 'desc' }], // Sort by creation date, newest first
      'created-date-old-new': [{ startDate: 'asc' }],
      'close-date-new-old': [{ closingDate: 'desc' }], // Sort by closing date, closest date first
      'close-date-old-new': [{ closingDate: 'asc' }],
    }

    const now = new Date()
    // Fetch polls from Prisma
    const polls = await prisma.poll.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          },
          {
            // Only include polls that haven't reached their closing date
            ...(isActive === true && { closingDate: { gt: now } }),

            // Only include polls that have already passed their closing date
            ...(isActive === false && { closingDate: { lt: now } }),
          },
        ],
      },
      select: {
        id: true,
        description: true,
        startDate: true,
        closingDate: true,
        img: true,
        title: true,
        players: {
          select: {
            player: true,
          },
        },
      },
      skip,
      take: validPerPage,
      orderBy:
        orderMap[sortKey ?? 'created-date-new-old'] ||
        orderMap['created-date-new-old'],
    })

    // Transform the fetched polls into PollDTO objects
    const pollDTOs: PollDTO[] = polls.map((poll) => ({
      ...poll,
      img: poll.img ? (JSON.parse(poll.img.toString()) as UploadedImage) : null,
      createdOn: poll.startDate,
      closesOn: poll.closingDate,
      players: poll.players.map((p) => ({
        ...p.player,
        img: p.player.img
          ? (JSON.parse(p.player.img.toString()) as UploadedImage)
          : null,
      })),
    }))

    return pollDTOs
  } catch (e) {
    console.error(
      `Poll fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return []
  }
}

type GetPollProps = {
  pollId: string
}

/**
 * Retrieves a single poll based on the provided ID.
 * @returns {Promise<PlayerDTO | null>} - The poll matching the criteria, or null if not found.
 */
export async function getPoll(
  props: Readonly<GetPollProps>
): Promise<PollDTO | null> {
  const { pollId } = props
  if (!pollId) {
    console.error('Poll id must be provided.')
    return null
  }

  try {
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId || undefined,
      },
      select: {
        id: true,
        description: true,
        startDate: true,
        closingDate: true,
        img: true,
        title: true,
        players: {
          select: {
            player: true,
          },
        },
      },
    })

    if (!poll) return null

    // Transform the fetched polls into PollDTO objects
    const pollDTO: PollDTO = {
      ...poll,
      img: poll.img ? (JSON.parse(poll.img.toString()) as UploadedImage) : null,
      createdOn: poll.startDate,
      closesOn: poll.closingDate,
      players: poll.players.map((p) => ({
        ...p.player,
        img: p.player.img
          ? (JSON.parse(p.player.img.toString()) as UploadedImage)
          : null,
      })),
    }
    return pollDTO
  } catch (e) {
    console.error(
      `Poll fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return null
  }
}

export interface UpdatePollDTO extends Omit<PollDTO, 'img' | 'createdOn'> {
  img: UploadedImage | null | undefined
}

/**
 * Updates a poll's data.
 * @param {UpdatePollDTO} updatedPollData - The data to update the poll with.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */
export async function updatePoll(
  updatedPollData: Readonly<UpdatePollDTO>
): Promise<ActionResponse> {
  const { id, title, description, closesOn, players, img } = updatedPollData

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
    await prisma.poll.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        closingDate: closesOn,
        players: {
          set: players.map((p) => ({
            pollId_playerId: {
              playerId: p.id,
              pollId: id,
            },
          })),
        },
      },
    })

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

export interface CreatePollDTO
  extends Omit<PollDTO, 'id' | 'players' | 'createdOn'> {
  playerIDs: string[]
}

/**
 * Creates a new poll
 * @param {CreatePollDTO} newPoll - The data of the new poll to be created.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */

export async function createPoll(newPoll: Readonly<CreatePollDTO>) {
  const { title, description, closesOn, img, playerIDs } = newPoll

  // Validate player IDs
  for (const playerId of playerIDs) {
    const player = await getPlayer({ playerId })
    if (!player) {
      return { type: 'error', message: `Invalid player ID: ${playerId}` }
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
    // Create a new poll record in the database
    await prisma.poll.create({
      data: {
        title,
        description,
        closingDate: closesOn,
        img: imgData,
        players: {
          create: playerIDs.map((playerId) => ({
            player: { connect: { id: playerId } },
          })),
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
