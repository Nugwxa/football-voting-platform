'use server'
import { getPoll } from '../poll'
import prisma from '@lib/prisma'
import { getUser } from '../user'

interface GetVotedPlayerIdProps {
  userId: string
  pollId: string
}

/**
 * Retrieves the ID of the player a user voted for in a specific poll
 *
 * @param {string} userId - The ID of the user whose vote is being checked
 * @param {string} pollId - The ID of the poll to check the user's vote in
 * @returns {Promise<string | null>} The ID of the selected player if the user has voted; otherwise, null
 */
export default async function getVotedPlayerId(
  props: Readonly<GetVotedPlayerIdProps>
): Promise<string | null> {
  const { userId, pollId } = props

  // Fetch the user and poll data concurrently
  const [user, poll] = await Promise.all([
    getUser({ userId }),
    getPoll({ pollId }),
  ])

  if (!user || !poll) return null

  try {
    // Check if the user has voted in the poll and retrieve the ID of the selected player
    const userVote = await prisma.vote.findFirst({
      where: {
        pollId,
        voterId: userId,
      },
    })

    return userVote?.selectedPlayerId ?? null
  } catch (e) {
    console.error(
      `User vote check database error: ${e instanceof Error ? e.message : e}`
    )
    return null
  }
}
