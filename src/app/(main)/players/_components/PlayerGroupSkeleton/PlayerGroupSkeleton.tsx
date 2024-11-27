'use server'
import PlayerSkeleton from '@/components/PlayerSkeleton'
import styles from '../PlayerGroup/PlayerGroup.module.css'
import skeletonStyles from './PlayerGroupSkeleton.module.css'
export default async function PlayerGroupSkeleton() {
  return (
    <section className={styles.playerGroup}>
      <h2 className={skeletonStyles.title}></h2>

      <div className={styles.playerCardsWrapper}>
        <PlayerSkeleton />
        <PlayerSkeleton />
        <PlayerSkeleton />
      </div>
    </section>
  )
}
