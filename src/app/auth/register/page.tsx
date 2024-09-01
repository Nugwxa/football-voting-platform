import { Metadata } from 'next'
import AuthNavButtonsWrapper from '../_component/AuthNavButtonsWrapper'
import authStyle from '../auth.layout.module.css'
import Divider from '@/components/Divider'
import formStyles from '@styles/formStyles.module.css'
import Link from 'next/link'
import RegistrationForm from './_component/RegistrationForm'

export const metadata: Metadata = {
  title: 'Register | Team 9 Voting',
  description: 'Welcome! Register to begin voting',
}
type SearchParams = {
  redirect?: string
}

interface RegisterPageProps {
  searchParams: SearchParams
}
export default async function Page(props: Readonly<RegisterPageProps>) {
  const { searchParams } = props
  const redirectTo = searchParams.redirect
  return (
    <div className={authStyle.authContentContainer}>
      <AuthNavButtonsWrapper className={authStyle.authNavButtonPositioning} />
      <RegistrationForm redirectTo={redirectTo} />

      <Divider />

      <div className={authStyle.authFooterSection}>
        Already have an account?{' '}
        <Link className={formStyles.anchorSpan} href={'/auth/login'}>
          Login
        </Link>
      </div>
    </div>
  )
}
