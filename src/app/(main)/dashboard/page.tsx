import { notFound } from 'next/navigation'
import readSession from '@/lib/session'
import styles from './page.module.css'

export default async function Page() {
  const session = await readSession()
  if (!session || !session.user.isAdmin) return notFound()
  return (
    <>
      <h1>Dashboard</h1>
      <div className={styles.body}>
        <section>
          <div className={styles.dashboardItemsWrapper}>Dashboard content</div>
        </section>
      </div>
    </>
  )
}
