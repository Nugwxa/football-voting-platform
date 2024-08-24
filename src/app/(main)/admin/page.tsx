import { adminNavLinks } from './data'
import { AlertTriangleIcon } from 'lucide-react'
import { countUsers } from '@/lib/user'
import { readSession } from '@/lib/session'
import adminStyles from './adminStyles.module.css'
import Callout from '@/components/Callout'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination/Pagination'
import SearchInput from '@/components/SearchInput'
import UserTable from './_components/UserTable'

type SearchParam = {
  query?: string
  page?: string
  sort?: string
}
interface AdminUsersPageProps {
  searchParams: SearchParam
}
export default async function Page(props: Readonly<AdminUsersPageProps>) {
  const session = await readSession()

  // Restrict access if the user is not authenticated
  if (!session || !session.user.isAdmin)
    return (
      <ContentWrapper>
        <Callout title="Restricted Page!" icon={<AlertTriangleIcon />} isWide>
          You don't have the permission to view this page
        </Callout>
      </ContentWrapper>
    )
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
