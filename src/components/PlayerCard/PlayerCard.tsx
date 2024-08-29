'use server'

import { PlayerCardDTO } from './types'
import classNames from 'classnames'
import Image from 'next/image'
import styles from './PlayerCard.module.css'

interface PlayerCardProps extends React.ComponentPropsWithoutRef<'div'> {
  player: PlayerCardDTO
}

/**
 * Renders a card displaying a player's information
 *
 * @param {PlayerCardDTO} player - The player data to display on the card.
 * @returns {Promise<JSX.Element>} The PlayerCard component.
 */
export default async function PlayerCard(
  props: Readonly<PlayerCardProps>
): Promise<JSX.Element> {
  const { player, className, ...rest } = props
  const { firstName, lastName, position, imgUrl, squadNumber } = player
  return (
    <div className={classNames(className, styles.playerCard)} {...rest}>
      {/* Display the player's squad number if available */}
      {squadNumber && <div className={styles.squadNumber}>{squadNumber}</div>}

      <div className={styles.playerCardContainer}>
        <div className={styles.playerInfoSection}>
          {/* Position */}
          <div className={styles.playerPosition}>{position}</div>
          <div className={styles.playerNameSection}>
            {/* First Name */}
            <span className={styles.playerFirstName}> {firstName}</span>
            {/* Last Name */}
            <div className={styles.playerLastName}>{lastName}</div>
          </div>
        </div>
      </div>

      {/* Gradient overlay to make text legible*/}
      <div className={styles.imageOverlayGradient}></div>

      {/* Display the player's image or a placeholder if not available */}
      <Image
        className={classNames(styles.playerImage)}
        priority
        sizes="(max-width: 768px) 768px"
        src={imgUrl ?? '/img/vacant.png'}
        alt={`${lastName}'s image`}
        fill
      />
    </div>
  )
}
