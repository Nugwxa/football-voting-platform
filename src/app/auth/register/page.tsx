'use server'
import authStyle from '../auth.layout.module.css'
import CreateUserForm from './client'
import Link from 'next/link'
import formStyles from '@styles/formStyles.module.css'

import AuthNavButtonsWrapper from '../_component/AuthNavButtonsWrapper'
import Divider from '@/components/Divider'

export default async function Page() {
  return (
    <div className={authStyle.authContentContainer}>
      <AuthNavButtonsWrapper className={authStyle.authNavButtonPositioning} />

      <CreateUserForm />

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
