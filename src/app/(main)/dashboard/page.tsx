import { DashboardStatContainer } from './client'
import { HandHelpingIcon, UsersIcon, VoteIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { readSession } from '@/lib/session'
import classNames from 'classnames'
import Link from 'next/link'
import Pagination from '@/components/Pagination/Pagination'
import prisma from '@lib/prisma'
import styles from './page.module.css'
import UsersTable from './server'
type SearchParams = Readonly<{
  page?: number
}>
type PageProps = Readonly<{
  searchParams: SearchParams
}>

export default async function Page(props: PageProps) {
  const { searchParams } = props
  const page = searchParams.page ?? 1
  const resultsPerPage = 10

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

        <section className={classNames(styles.section, styles.tableSection)}>
          <div className={styles.sectionHeader}>
            <h2>Users</h2>
            <div>
              <Link className={styles.link} href={'/dashboard/polls'}>
                View Polls
              </Link>
            </div>
          </div>
          <UsersTable page={page} />
          <Pagination totalPages={Math.ceil(userCount / resultsPerPage)} />
        </section>
      </div>
    </>
  )
}
