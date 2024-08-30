'use server'
import { getPlayer } from '../player'
import { getPoll } from '../poll'
import prisma from '@lib/prisma'

interface GetPlayerVotePercentProps {
  playerId: string
  pollId: string
}

/**
 * Calculates the percentage of votes received by a player in a specific poll
 *
 * @param {string} playerId - The ID of the player whose votes are being counted
 * @param {string} pollId - The ID of the poll in which the votes are being counted
 * @returns {Promise<number>} The percentage of votes the player received in the poll. Returns 0 if player or poll is not found or an error occurs.
 *
 * @example
 * const votePercent = await getPlayerVotePercent({ playerId: 'player123', pollId: 'poll456' })
 * console.log(votePercent) // Outputs the percentage of votes for the player
 */
export async function getPlayerVotePercent(
  props: Readonly<GetPlayerVotePercentProps>
): Promise<number> {
  const { playerId, pollId } = props

  // Fetch the player and poll data concurrently
  const [player, poll] = await Promise.all([
    getPlayer({ playerId }),
    getPoll({ pollId }),
  ])

  if (!player || !poll) return 0

  try {
    // Count the total votes for the poll that are associated with any
    // player in the poll at the time of the request.

    // Q: Why not just count all the votes?
    // A: There might be players who've received votes and have now been
    // removed from the poll. Their votes won't be deleted from the
    // database so they would still have their record if they are added at a later date.
    // Counting all the votes include their votes and the total percentage on the UI won't add up.

    const totalValidPollVotes = await prisma.vote.count({
      where: {
        pollId,
        selectedPlayerId: {
          // Only count votes for players participating in the poll
          in: poll.players.map((p) => p.id),
        },
      },
    })

    // Count the total votes received by the specific player in the poll
    const totalPlayerVotes = await prisma.vote.count({
      where: {
        pollId,
        selectedPlayerId: playerId,
      },
    })

    // Calculate the percentage of votes the player received out of the total valid votes
    const percentage =
      totalValidPollVotes > 0
        ? (totalPlayerVotes / totalValidPollVotes) * 100
        : 0 // Avoid division by zero

    return percentage
  } catch (e) {
    console.error(
      `Player vote percent count database error: ${
        e instanceof Error ? e.message : e
      }`
    )
    return 0
  }
}
