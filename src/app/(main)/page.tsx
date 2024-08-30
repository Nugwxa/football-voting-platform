import { countPolls, getPolls } from '@/data/poll'
import { PollCardDTO } from './_components/PollCard/types'
import classNames from 'classnames'
import ContentWrapper from '@/components/ContentWrapper'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import PollCard from './_components/PollCard/'
import styles from './page.module.css'

type SearchParam = {
  page?: string
  filter?: string
}
interface PollsPageProps {
  searchParams: SearchParam
}
export default async function Page(props: Readonly<PollsPageProps>) {
  const { searchParams } = props
  const page = searchParams.page ?? 1
  const filter = searchParams.filter ?? 'open'

  const polls = await getPolls({
    page: Number(page),
    isActive: filter !== 'closed',
    sortKey: 'close-date-old-new',
  })

  // Count the total number of polls based on the search query
  const pollCount = await countPolls({ isActive: filter !== 'closed' })
  const perPage = 10
  return (
    <>
      <PageHeader title="Polls" />

      <ContentWrapper className={styles.headingAcionWrapper}>
        <section className={styles.headingAcionSection} key={filter}>
          <Link
            className={classNames({
              [styles.activeFilterLink]: filter !== 'closed',
            })}
            href={'/'}
          >
            Active
          </Link>
          <Link
            className={classNames({
              [styles.activeFilterLink]: filter === 'closed',
            })}
            href={'/?filter=closed'}
          >
            Closed
          </Link>
        </section>
      </ContentWrapper>

      <ContentWrapper>
        <section className={styles.pollCardsWrapper}>
          {polls.map((poll) => {
            const pollObj: PollCardDTO = {
              id: poll.id,
              imgURL: poll.img?.link,
              closesOn: poll.closesOn,
              title: poll.title,
            }
            return <PollCard key={poll.id} poll={pollObj} />
          })}
        </section>
      </ContentWrapper>

      {/* Pagination component to navigate through pages */}
      <Pagination totalPages={Math.ceil(pollCount / perPage)} />
    </>
  )
}
