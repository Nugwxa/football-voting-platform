import { DashboardStatContainer } from './client'
import { HandHelpingIcon, UsersIcon, VoteIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import prisma from '@lib/prisma'
import readSession from '@/lib/session'
import styles from './page.module.css'

export default async function Page() {
  const session = await readSession()
  if (!session || !session.user.isAdmin) return notFound()

  const userCount = await prisma.user.count()
  const pollCount = await prisma.vote.count()
  const voteCount = await prisma.voteRegigtration.count()
  const iconSize = 20
  return (
    <>
      <h1>Dashboard</h1>
      <div className={styles.body}>
        <section className={styles.section}>
          <h2>Stats</h2>
          <div className={styles.dashboardItemsWrapper}>
            <DashboardStatContainer
              count={userCount}
              text="Users"
              icon={<UsersIcon size={iconSize} />}
            />

            <DashboardStatContainer
              count={pollCount}
              text="Polls"
              icon={<VoteIcon size={iconSize} />}
            />

            <DashboardStatContainer
              count={voteCount}
              text="Registered Votes"
              icon={<HandHelpingIcon size={iconSize} />}
            />
          </div>
        </section>
      </div>
    </>
  )
}
