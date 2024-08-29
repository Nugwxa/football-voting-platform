'use server'
import { PollDTO } from './types'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

type GetPollsProps = {
  query?: string
  sortKey?: string
  page?: number
  perPage?: number
  isActive?: boolean
}

/**
 * Retrieves a list of polls based on the provided search criteria.
 *  * @param {string} query - The search query to filter polls by title or description.
 * @param {string} sortKey - The key used to sort the polls.
 * @param {number} page - The page number for pagination. Defaults to 1.
 * @param {number} perPage - The number of polls to retrieve per page. Defaults to 10.
 * @param {boolean} isActive - Filter for active polls (true for active, false for inactive). If not specified, both active and inactive polls are returned.
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
        players: true,
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
        ...p,
        img: p.img ? (JSON.parse(p.img.toString()) as UploadedImage) : null,
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
