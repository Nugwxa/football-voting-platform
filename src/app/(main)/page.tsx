import { countPolls } from '@/data/poll'
import { Suspense } from 'react'
import classNames from 'classnames'
import ContentWrapper from '@/components/ContentWrapper'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import PollCardSkeleton from './_components/PollCardSkeleton'
import PollsGrid from './_components/PollsGrid'
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

  // Count the total number of polls based on the search query
  const pollCount = await countPolls({ isActive: filter !== 'closed' })
  const perPage = 10
  return (
    <>
      <PageHeader title="Polls" />

      <ContentWrapper className={styles.headingActionWrapper}>
        <section className={styles.headingActionSection} key={filter}>
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
          <Suspense
            fallback={
              <>
                <PollCardSkeleton />
                <PollCardSkeleton />
                <PollCardSkeleton />
                <PollCardSkeleton />
              </>
            }
          >
            <PollsGrid
              page={page}
              sortKey={'close-date-old-new'}
              isActive={filter !== 'closed'}
            />
          </Suspense>
        </section>

        <Pagination totalPages={Math.ceil(pollCount / perPage)} />
      </ContentWrapper>
    </>
  )
}
