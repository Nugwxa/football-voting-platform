import { adminNavLinks } from './data'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'

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
      <ContentWrapper>Content Here</ContentWrapper>
    </>
  )
}
