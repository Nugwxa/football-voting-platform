import { adminNavLinks } from '@admin/data'
import { countPolls } from '@/data/poll'
import { Metadata } from 'next'
import { PlusIcon } from 'lucide-react'
import adminStyles from '@admin/adminStyles.module.css'
import Button from '@/components/Button'
import ContentWrapper from '@/components/ContentWrapper'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination/'
import PollTable from './_components/PollTable/PollTable'
import SearchInput from '@/components/SearchInput'

export const metadata: Metadata = {
  title: 'Polls (Admin) | Team 9 Voting',
}

type SearchParam = {
  query?: string
  page?: string
  sort?: string
}
interface AdminPollsPageProps {
  searchParams: SearchParam
}
export default async function Page(props: Readonly<AdminPollsPageProps>) {
  const { searchParams } = props
  const page = searchParams.page ?? 1
  const query = searchParams.query ?? ''
  const sort = searchParams.sort ?? 'created-date-new-old'

  // Count the total number of polls based on the search query
  const pollCount = await countPolls({ query })
  const perPage = 10
  return (
    <>
      <PageHeader title="Polls" links={adminNavLinks} />
      <ContentWrapper>
        <section className={adminStyles.headingActionsSection}>
          {/* Search input for filtering polls */}
          <SearchInput
            className={adminStyles.searchInput}
            placeholder="Search polls ..."
          />

          <Button
            icon={<PlusIcon />}
            className={adminStyles.adminButton}
            as={Link}
            href={'/admin/polls/new'}
            mode="border"
          >
            New Poll
          </Button>
        </section>

        {/* Poll table displaying the list of players */}
        <PollTable page={Number(page)} sort={sort} query={query} />

        {/* Pagination component to navigate through pages */}
        <Pagination totalPages={Math.ceil(pollCount / perPage)} />
      </ContentWrapper>
    </>
  )
}
