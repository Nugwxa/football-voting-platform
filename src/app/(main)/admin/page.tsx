import { adminNavLinks } from '@admin/data'
import { countUsers } from '@/data/user'
import { Metadata } from 'next'
import adminStyles from '@admin/adminStyles.module.css'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination/Pagination'
import SearchInput from '@/components/SearchInput'
import UserTable from './_components/UserTable'

export const metadata: Metadata = {
  title: 'Users (Admin)',
}

type SearchParam = {
  query?: string
  page?: string
  sort?: string
}
interface AdminUsersPageProps {
  searchParams: SearchParam
}
export default async function Page(props: Readonly<AdminUsersPageProps>) {
  const { searchParams } = props
  const page = searchParams.page ?? 1
  const query = searchParams.query ?? ''
  const sort = searchParams.sort ?? 'joined-newest'

  // Count the total number of users based on the search query
  const userCount = await countUsers(query)
  const perPage = 10
  return (
    <>
      {/* Page header with navigation links */}
      <PageHeader title="Users" links={adminNavLinks} />
      <ContentWrapper>
        <section className={adminStyles.headingActionsSection}>
          {/* Search input for filtering users */}
          <SearchInput
            className={adminStyles.searchInput}
            placeholder="Search users ..."
          />
        </section>

        {/* User table displaying the list of users */}
        <UserTable page={Number(page)} query={query} sort={sort} />

        {/* Pagination component to navigate through pages */}
        <Pagination totalPages={Math.ceil(userCount / perPage)} />
      </ContentWrapper>
    </>
  )
}
