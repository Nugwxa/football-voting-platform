'use client'
import { createVote } from '@/data/vote/'
import Button from '@/components/Button'

interface VoteButtonProps {
  userId: string
  pollId: string
  playerId: string
}

/**
 * Renders a button that allows users to vote for a specific player in a poll.
 *
 * @param {string} userId - The ID of the user casting the vote.
 * @param {string} pollId - The ID of the poll where the vote is being cast.
 * @param {string} playerId - The ID of the player being voted for.
 */
export default function VoteButton(props: Readonly<VoteButtonProps>) {
  const { playerId, pollId, userId } = props
  async function handleClick() {
    await createVote({
      userId,
      pollId,
      playerId,
    })
  }
  return (
    <Button mode="border" onClick={handleClick} isWide>
      Vote
    </Button>
  )
}
