'use server'
import { getPlayer } from '../player'
import { getPoll } from '../poll'
import { getUser } from '../user'
import { readSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import prisma from '@lib/prisma'

interface CreateVoteProps {
  userId: string
  pollId: string
  playerId: string
}

/**
 * Creates a vote for a specified player in a poll by a user.
 *
 * @param {string} userId - The ID of the user casting the vote.
 * @param {string} pollId - The ID of the poll where the vote is being cast.
 * @param {string} playerId - The ID of the player being voted for.

 */
export async function createVote(props: Readonly<CreateVoteProps>) {
  const { userId, pollId, playerId } = props

  // Read the session to validate the user is authenticated
  const session = await readSession()

  if (!session) return

  // Check if user, poll, and player all exist
  const [user, poll, player] = await Promise.all([
    getUser({ userId }),
    getPoll({ pollId }),
    getPlayer({ playerId }),
  ])

  if (!user || !poll || !player) return

  try {
    // Create a new vote record in the database
    await prisma.vote.create({
      data: {
        pollId,
        voterId: userId,
        selectedPlayerId: playerId,
      },
    })

    // Trigger revalidation of the poll's path to ensure the latest data is reflected
    revalidatePath(`/polls/${pollId}`)
  } catch (e) {
    console.error(
      `Vote creation database error: ${e instanceof Error ? e.message : e}`
    )
  }
}
