'use server'
import { PollDTO } from './types'
import prisma from '@/lib/prisma'

type GetPollProps = {
  pollId: string
}

/**
 * Retrieves a single poll based on the provided ID.
 * @param {string} pollId - The ID of the poll to retrieve.
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
          orderBy: {
            lastName: 'asc',
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
        ...p,
        img: p.img ? (JSON.parse(p.img.toString()) as UploadedImage) : null,
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
