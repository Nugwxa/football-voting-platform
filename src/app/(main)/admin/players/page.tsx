import { adminNavLinks } from '@admin/data'
import { countPlayers } from '@/data/player'
import { Metadata } from 'next'
import { PlusIcon } from 'lucide-react'
import adminStyles from '@admin/adminStyles.module.css'
import Button from '@/components/Button'
import ContentWrapper from '@/components/ContentWrapper'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination/'
import PlayerTable from './_components/PlayerTable'
import SearchInput from '@/components/SearchInput'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Players (Admin)',
}

type SearchParam = {
  query?: string
  page?: string
  sort?: string
}
interface AdminPlayersPageProps {
  searchParams: SearchParam
}
export default async function Page(props: Readonly<AdminPlayersPageProps>) {
  const { searchParams } = props
  const page = searchParams.page ?? 1
  const query = searchParams.query ?? ''
  const sort = searchParams.sort ?? 'name-az'

  // Count the total number of players based on the search query
  const playerCount = await countPlayers(query)
  const perPage = 10
  return (
    <>
      <PageHeader title="Players" links={adminNavLinks} />
      <ContentWrapper>
        <section className={adminStyles.headingActionsSection}>
          {/* Search input for filtering players */}
          <SearchInput
            className={adminStyles.searchInput}
            placeholder="Search players"
          />

          <Button
            icon={<PlusIcon />}
            className={adminStyles.adminButton}
            as={Link}
            href={'/admin/players/new'}
            mode="border"
          >
            New Player
          </Button>
        </section>

        {/* Player table displaying the list of players */}
        <PlayerTable page={Number(page)} query={query} sort={sort} />

        {/* Pagination component to navigate through pages */}
        <Pagination totalPages={Math.ceil(playerCount / perPage)} />
      </ContentWrapper>
    </>
  )
}
