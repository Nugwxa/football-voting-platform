import { adminNavLinks } from './data'
import adminStyles from './adminStyles.module.css'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'
import SearchInput from '@/components/SearchInput'
import UserTable from './_components/UserTable'

type SearchParam = {
  query?: string
  page?: string
}
interface AdminUsersPageProps {
  searchParams: SearchParam
}
export default async function Page(props: Readonly<AdminUsersPageProps>) {
  const { searchParams } = props

  const page = searchParams.page ?? 1
  const query = searchParams.query ?? ''
  return (
    <>
      <PageHeader title="Users" links={adminNavLinks} />
      <ContentWrapper>
        <section className={adminStyles.headingActionsSection}>
          <SearchInput
            className={adminStyles.searchInput}
            placeholder="Search users ..."
          />
        </section>

        <UserTable page={Number(page)} query={query} />
      </ContentWrapper>
    </>
  )
}
