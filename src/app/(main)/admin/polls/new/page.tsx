import { adminNavLinks } from '@admin/data'
import { Metadata } from 'next'
import ContentWrapper from '@/components/ContentWrapper'
import CreatePollForm from './_components/CreatePollForm'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'New Poll (Admin)',
}
export default async function Page() {
  return (
    <>
      <PageHeader title="Polls" links={adminNavLinks} />
      <ContentWrapper>
        <section style={{ width: '100%' }}>
          <CreatePollForm />
        </section>
      </ContentWrapper>
    </>
  )
}
