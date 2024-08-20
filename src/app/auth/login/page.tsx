import { LoginForm } from './client'
import AuthNavButtonsWrapper from '../_component/AuthNavButtonsWrapper'
import authStyle from '../auth.layout.module.css'
import Link from 'next/link'
import Divider from '@/components/Divider'
import formStyles from '@styles/formStyles.module.css'
type SearchParams = {
  redirect?: string
}

interface LoginPageProps {
  searchParams: SearchParams
}

export default async function Page(props: Readonly<LoginPageProps>) {
  const { searchParams } = props

  const redirectTo = searchParams.redirect
  return (
    <div className={authStyle.authContentContainer}>
      <AuthNavButtonsWrapper className={authStyle.authNavButtonPositioning} />

      <LoginForm redirectTo={redirectTo} />
      <Divider />

      <div className={authStyle.authFooterSection}>
        Don't have an account?{' '}
        <Link className={formStyles.anchorSpan} href={'/auth/register'}>
          Register Now
        </Link>
      </div>
    </div>
  )
}
