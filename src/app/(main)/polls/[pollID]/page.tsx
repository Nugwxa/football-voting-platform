import { checkWinner } from '@/data/vote/checkWinner'
import { getPoll } from '@/data/poll'
import { getVotedPlayerId } from '@/data/vote/'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { readSession } from '@/lib/session'
import ContentWrapper from '@/components/ContentWrapper'
import Countdown from '@/components/Countdown'
import Image from 'next/image'
import PlayerVoteCard from './_components/PlayerVoteCard'
import styles from './page.module.css'

type Params = {
  pollID?: string
}

interface PollsPageProps {
  params: Params
}

// Generate metadata for the poll
export async function generateMetadata({
  params,
}: PollsPageProps): Promise<Metadata> {
  const poll = await getPoll({ pollId: params.pollID ?? '' })

  // Fallbacks in case poll data is missing
  const metaTitle = `${poll ? poll.title + ' | ' : ''}Team9 Voting`
  const metaDescription =
    poll?.description ||
    'Check out this poll and vote for your favorite player.'
  const metaImage =
    poll?.img?.link || `${process.env.HOST_URL}/img/poll_default.jpg`
  const metaUrl = `${process.env.HOST_URL}/polls/${params.pollID}`

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      images: [
        {
          url: metaImage,
          width: 800,
          height: 600,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    alternates: {
      canonical: metaUrl,
    },
  }
}
export default async function Page(props: Readonly<PollsPageProps>) {
  const { params } = props

  const poll = await getPoll({ pollId: params.pollID ?? '' })
  if (!poll) return notFound()

  const session = await readSession()
  const pollIsClosed = new Date(poll.closesOn) < new Date()
  const userId = session?.user.id ?? '  '
  const selectedPlayerId = await getVotedPlayerId({
    userId: userId,
    pollId: poll.id,
  })

  const winners = (await checkWinner(poll.id)).map((winner) => winner.playerId)

  return (
    <>
      <ContentWrapper className={styles.headingSectionWrapper}>
        <Image
          key={poll.id}
          className={styles.coverImage}
          priority
          sizes="(max-width: 768px) 768px"
          src={poll.img?.link ?? '/img/poll_default.jpg'}
          alt={`${poll.title}`}
          fill
        />
      </ContentWrapper>

      <ContentWrapper>
        <h1 className={styles.pollTitle}>{poll.title}</h1>

        <Countdown targetDate={poll.closesOn} />

        <p>{poll.description}</p>

        <h2>Players</h2>

        <div className={styles.playersWrapper}>
          {poll.players.map((player) => {
            return (
              <PlayerVoteCard
                key={player.id}
                player={player}
                userId={session?.user.id}
                pollId={poll.id}
                winners={winners}
                selectedPlayerId={selectedPlayerId}
                pollIsClosed={pollIsClosed}
              />
            )
          })}
        </div>
      </ContentWrapper>
    </>
  )
}
