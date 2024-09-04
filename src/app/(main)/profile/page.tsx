import { notFound } from 'next/navigation'
import { readSession } from '@/lib/session'
import Button from '@/components/Button'
import ContentWrapper from '@/components/ContentWrapper'
import Link from 'next/link'
import LogoutButton from './_components/LogoutButton/'
import styles from './page.module.css'
import UpdateProfileForm from './_components/UpdateProfileForm'

export default async function Page() {
  const session = await readSession()

  if (!session) return notFound()
  return (
    <ContentWrapper>
      <h1>Update Profile</h1>

      <div className={styles.container}>
        <UpdateProfileForm user={session.user} />
        <Button
          as={Link}
          mode="border"
          data-theme="orange"
          href={'/auth/reset/new-password?redirect=/profile'}
          isWide
        >
          Change Password
        </Button>

        <LogoutButton />
      </div>
    </ContentWrapper>
  )
}
