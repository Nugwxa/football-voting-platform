'use server'
import { getPlayerVotePercent } from '@/data/vote'
import { PlayerCardDTO } from '@/components/PlayerCard/types'
import { PlayerDTO } from '@/data/player/types'
import Button from '@/components/Button'
import classNames from 'classnames'
import Link from 'next/link'
import PlayerCard from '@/components/PlayerCard'
import styles from './PlayerVoteCard.module.css'
import VoteButton from './VoteButton'

interface PlayerVoteCardProps {
  player: PlayerDTO
  userId?: string
  pollId: string
  pollIsClosed: boolean
  selectedPlayerId: string | null
  winners: string[]
}

/**
 * Renders a card component for a player, displaying voting options and results.
 *
 * @param {PlayerDTO} player - The player details.
 * @param {string}pollId - The ID of the poll.
 * @param {boolean} pollIsClosed - Indicates if the poll is closed.
 * @param {string | null} selectedPlayerId - The ID of the selected player, if any.
 * @param {string[]} winners - List of player IDs who are winners.
 * @param {string} userId - The ID of the user, if logged in.
 */
export default async function PlayerVoteCard(
  props: Readonly<PlayerVoteCardProps>
): Promise<JSX.Element> {
  const { player, userId, pollId, winners, selectedPlayerId, pollIsClosed } =
    props

  // Player object passed to PlayerCard component
  const playerOBJ: PlayerCardDTO = {
    firstName: player.firstName,
    lastName: player.lastName,
    squadNumber: null,
    imgUrl: player.img?.link,
    position: player.position,
  }

  // Determine if the card should be disabled based on poll state and winner status
  const isDisabled =
    pollIsClosed && winners.length > 0 && !winners.includes(player.id)
  let interactiveItem = <></>

  // Check if poll is closed or if the user has already voted
  if (pollIsClosed || selectedPlayerId) {
    // Get the vote percentage for the player
    const playerVotePercent = await getPlayerVotePercent({
      playerId: player.id,
      pollId,
    })

    // Render the vote result bar with the calculated percentage
    interactiveItem = (
      <div
        className={styles.voteResultBar}
        style={
          {
            '--vote-percent': `${playerVotePercent}%`,
          } as React.CSSProperties & {
            '--vote-percent'?: string
          }
        }
      >
        {playerVotePercent}%
      </div>
    )
  } else if (userId) {
    // Render the VoteButton for authenticated users who haven't voted yet
    interactiveItem = (
      <VoteButton userId={userId} pollId={pollId} playerId={player.id} />
    )
  } else {
    // Show a sign-in button if the user is not authenticated
    interactiveItem = (
      <Button
        mode="border"
        as={Link}
        isWide
        href={`/auth/login/?redirect=/polls/${pollId}`}
      >
        Sign in to vote
      </Button>
    )
  }
  return (
    <div
      className={classNames(styles.playerVoteCard, {
        [styles.disabled]: isDisabled,
      })}
    >
      <PlayerCard
        className={classNames({
          [styles.selectedPlayer]: selectedPlayerId === player.id,
        })}
        player={playerOBJ}
      />

      {interactiveItem}
    </div>
  )
}
