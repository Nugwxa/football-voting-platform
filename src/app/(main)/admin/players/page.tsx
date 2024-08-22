import { adminNavLinks } from '../data'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'

export default async function Page() {
  return (
    <>
      <PageHeader title="Players" links={adminNavLinks} />
      <ContentWrapper>Content Here</ContentWrapper>
    </>
  )
}
