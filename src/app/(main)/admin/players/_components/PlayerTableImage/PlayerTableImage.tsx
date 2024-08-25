'use client'
import classNames from 'classnames'
import Image from 'next/image'
import styles from './PlayerTableImage.module.css'

interface PlayerTableImageProps extends React.ComponentPropsWithoutRef<'div'> {
  name: string
  imgUrl?: string
}

/**
 * Renders a player's image with an overlay gradient.
 *
 * @param {string} name - The name of the player.
 * @param {string} imgUrl - The URL of the player's image. If not provided, a default image is used.
 */
export default function PlayerTableImage(
  props: Readonly<PlayerTableImageProps>
) {
  const { name, imgUrl, className } = props

  return (
    <div className={classNames(className, styles.playerTableImage)}>
      <div className={styles.imageOverlayGradient}></div>
      <div className={styles.imageWrapper}>
        <Image
          priority
          sizes="(max-width: 768px) 54px"
          src={imgUrl ?? '/img/vacant.png'}
          alt={`${name}'s image`}
          fill
        />
      </div>
    </div>
  )
}
