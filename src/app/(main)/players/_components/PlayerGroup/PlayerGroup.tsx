import { $Enums } from '@prisma/client'
import { getPlayers } from '@/data/player'
import { PlayerCardDTO } from '@/components/PlayerCard/types'
import PlayerCard from '@/components/PlayerCard/'
import styles from './PlayerGroup.module.css'

interface PlayerGroupProps extends React.ComponentPropsWithoutRef<'section'> {
  position: $Enums.PlayerPositions
}

/**
 * Renders a group of active players with the provided position
 *@param {$Enums.PlayerPositions} position - The position of the players to be grouped and displayed
 */
export default async function PlayerGroup(
  props: Readonly<PlayerGroupProps>
): Promise<JSX.Element | null> {
  const { position } = props

  // Fetch players from the provided position, ensuring they are active and sorted by squad number
  const players = await getPlayers({
    isPaginated: false,
    position,
    isActive: true,
    sortKey: 'squad-number',
  })

  // If no players are found, don't render the section.
  if (players.length < 1) return null

  return (
    <section className={styles.playerGroup}>
      <h2>{position}s</h2>

      <div className={styles.playerCardsWrapper}>
        {players.map((player) => {
          const playerOBJ: PlayerCardDTO = {
            firstName: player.firstName,
            lastName: player.lastName,
            squadNumber: player.squadNumber,
            imgUrl: player.img?.link,
            position: player.position,
          }
          return <PlayerCard key={player.id} player={playerOBJ} />
        })}
      </div>
    </section>
  )
}
