'use server'

import AuthNavButtonsWrapper from '../_component/AuthNavButtonsWrapper'
import authStyle from '../auth.layout.module.css'
import Divider from '@/components/Divider'
import formStyles from '@styles/formStyles.module.css'
import Link from 'next/link'
import RegistrationForm from './_component/RegistrationForm'

export default async function Page() {
  return (
    <div className={authStyle.authContentContainer}>
      <AuthNavButtonsWrapper className={authStyle.authNavButtonPositioning} />
      <RegistrationForm />

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
