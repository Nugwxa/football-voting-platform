import { adminNavLinks } from '../data'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'

export default async function Page() {
  return (
    <>
      <PageHeader title="Polls" links={adminNavLinks} />
      <ContentWrapper>Content Here</ContentWrapper>
    </>
  )
}
