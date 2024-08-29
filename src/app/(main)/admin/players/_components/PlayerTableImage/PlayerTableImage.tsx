'use client'
import classNames from 'classnames'
import Image from 'next/image'
import styles from './PlayerTableImage.module.css'

interface PlayerTableImageProps extends React.ComponentPropsWithoutRef<'div'> {
  name: string
  imgUrl?: string
  isActive: boolean
}

/**
 * Renders a player's image with an overlay gradient.
 *
 * @param {string} name - The name of the player.
 * @param {string} imgUrl - The URL of the player's image. If not provided, a default image is used.
 * @param {boolean} isAcive - The player's active status.
 */
export default function PlayerTableImage(
  props: Readonly<PlayerTableImageProps>
) {
  const { name, imgUrl, isActive, className, ...rest } = props

  return (
    <div className={classNames(className, styles.playerTableImage)} {...rest}>
      <div className={styles.imageOverlayGradient}></div>
      <div className={styles.imageWrapper}>
        <Image
          className={classNames({ [styles.alumniPlayer]: !isActive })}
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
