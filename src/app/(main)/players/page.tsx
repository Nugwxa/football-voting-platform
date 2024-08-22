import PageHeader from '@/components/PageHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Players | Team 9 Voting',
  description: 'View the team',
}

export default async function Page() {
  return (
    <>
      <PageHeader title="Players" />
    </>
  )
}
