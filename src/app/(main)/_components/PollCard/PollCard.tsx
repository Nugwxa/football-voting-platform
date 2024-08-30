import { PollCardDTO } from './types'
import Badge from '@/components/Badge'
import Button from '@/components/Button'
import Countdown from '@/components/Countdown'
import Image from 'next/image'
import Link from 'next/link'
import styles from './PollCard.module.css'

interface PollCardProps extends React.ComponentPropsWithoutRef<'div'> {
  poll: PollCardDTO
}

/**
 * Renders a cards displaying a poll's information and a link to view the poll
 *
 * @param {PollCardDTO} poll - The poll data object containing information about the poll
 */
export default async function PollCard(
  props: Readonly<PollCardProps>
): Promise<JSX.Element> {
  const { poll, ...rest } = props
  const now = new Date()
  return (
    <div className={styles.pollCard}>
      <div className={styles.coverImageWrapper}>
        {/* Poll cover image*/}
        <Link href={`/poll/${poll.id}`}>
          <Image
            key={poll.id}
            className={styles.coverImage}
            priority
            sizes="(max-width: 768px) 768px"
            src={poll.imgURL ?? '/img/poll_default.jpeg'}
            alt={`${poll.title}`}
            fill
          />
        </Link>
      </div>

      {/* Poll title*/}
      <h3 className={styles.pollTitle} title={poll.title}>
        <Link href={`/poll/${poll.id}`}>{poll.title}</Link>
      </h3>

      {/* Display a badge if the poll is closed, otherwise show a
     countdown to the close date */}
      {poll.closesOn < now ? (
        <Badge data-theme="red">Closed</Badge>
      ) : (
        <Countdown key={poll.id} targetDate={poll.closesOn} />
      )}

      <Button as={Link} href={`/poll/${poll.id}`} isWide isBold>
        View Poll
      </Button>
    </div>
  )
}
