'use server'
import { getPoll } from '../poll'
import prisma from '@lib/prisma'

interface PlayerWithVoteCount {
  playerId: string
  voteCount: number
}

/**
 * Determines the player(s) with the highest vote count in a given poll
 * Returns an empty array if no votes are cast or if the poll does not exist
 *
 * @param {string} pollId - The ID of the poll to check for a winner
 * @returns {Promise<PlayerWithVoteCount[]>} An array of players with the highest vote counts
 */
export async function checkWinner(
  pollId: string
): Promise<PlayerWithVoteCount[]> {
  try {
    // Fetch the poll data to get the list of players
    const poll = await getPoll({ pollId })

    if (!poll) return []

    // Get the list of player IDs from the poll
    const playerIds = poll.players.map((player) => player.id)

    // Count votes for each player in the poll
    const voteCounts = await prisma.vote.groupBy({
      by: ['selectedPlayerId'],
      where: {
        pollId,
        selectedPlayerId: {
          in: playerIds,
        },
      },
      _count: {
        selectedPlayerId: true,
      },
    })

    if (voteCounts.length === 0) {
      return []
    }

    // Find the maximum vote count among all players
    const maxVoteCount = Math.max(
      ...voteCounts.map((vote) => vote._count.selectedPlayerId)
    )

    // Filter players who have the maximum vote count (including ties)
    const winners = voteCounts
      .filter((vote) => vote._count.selectedPlayerId === maxVoteCount)
      .map((vote) => ({
        playerId: vote.selectedPlayerId,
        voteCount: vote._count.selectedPlayerId,
      }))

    return winners
  } catch (e) {
    console.error(
      `Error checking poll winner: ${e instanceof Error ? e.message : e}`
    )
    return []
  }
}
