'use server'
import { getPoll } from '../poll'
import { getUser } from '../user'
import prisma from '@lib/prisma'

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
export async function getVotedPlayerId(
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
    if (!userVote) return null

    // Check if the selected player is still part of the poll
    const isPlayerInPoll = poll.players.some(
      (player) => player.id === userVote.selectedPlayerId
    )

    // Return the ID of the selected player if they are still part of the poll; otherwise, return null
    return isPlayerInPoll ? userVote.selectedPlayerId : null
  } catch (e) {
    console.error(
      `User vote check database error: ${e instanceof Error ? e.message : e}`
    )
    return null
  }
}
