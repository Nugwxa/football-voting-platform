'use client'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import styles from './PollTableImage.module.css'

interface PlayerTableImageProps extends React.ComponentPropsWithoutRef<'div'> {
  imgUrl?: string
  link: string
}

/**
 * Renders a poll's cover image.
 *
 * @param {string} imgUrl - The URL of the poll's cover image. If not provided, a default image is used.
 */
export default function PollTableImage(props: Readonly<PlayerTableImageProps>) {
  const { imgUrl, className, link, ...rest } = props
  return (
    <div className={classNames(className, styles.playerTableImage)} {...rest}>
      <Link href={link} className={styles.imageWrapper}>
        <Image
          className={classNames(styles.image)}
          priority
          sizes="(max-width: 768px) 100px"
          src={imgUrl ?? '/img/poll_default.jpeg'}
          alt={`image`}
          fill
        />
      </Link>
    </div>
  )
}
