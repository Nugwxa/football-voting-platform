import { adminNavLinks } from '@admin/data'
import { Metadata } from 'next'
import ContentWrapper from '@/components/ContentWrapper'
import CreatePlayerForm from './_components/CreatePlayerForm'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'New Player (Admin) | Team 9 Voting',
}
export default async function Page() {
  return (
    <>
      <PageHeader title="Players" links={adminNavLinks} />
      <ContentWrapper>
        <section style={{ width: '100%' }}>
          <CreatePlayerForm />
        </section>
      </ContentWrapper>
    </>
  )
}
