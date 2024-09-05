import { Metadata } from 'next'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'
import PlayerGroup from './_components/PlayerGroup'

export const metadata: Metadata = {
  title: 'Players',
  description: 'View the team',
}

export default async function Page() {
  return (
    <>
      <PageHeader title="Players" />

      <ContentWrapper>
        <PlayerGroup position="Goalkeeper" />
        <PlayerGroup position="Defender" />
        <PlayerGroup position="Midfielder" />
        <PlayerGroup position="Forward" />
      </ContentWrapper>
    </>
  )
}
