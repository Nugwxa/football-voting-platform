import { Metadata } from 'next'
import { Suspense } from 'react'
import ContentWrapper from '@/components/ContentWrapper'
import PageHeader from '@/components/PageHeader'
import PlayerGroup from './_components/PlayerGroup'
import PlayerGroupSkeleton from './_components/PlayerGroupSkeleton'

export const metadata: Metadata = {
  title: 'Players',
  description: 'View the team',
}

export default async function Page() {
  return (
    <>
      <PageHeader title="Players" />

      <ContentWrapper>
        <Suspense fallback={<PlayerGroupSkeleton />}>
          <PlayerGroup position="Goalkeeper" />
        </Suspense>
        <Suspense fallback={<PlayerGroupSkeleton />}>
          <PlayerGroup position="Defender" />
        </Suspense>
        <Suspense fallback={<PlayerGroupSkeleton />}>
          <PlayerGroup position="Midfielder" />
        </Suspense>
        <Suspense fallback={<PlayerGroupSkeleton />}>
          <PlayerGroup position="Forward" />
        </Suspense>
      </ContentWrapper>
    </>
  )
}
