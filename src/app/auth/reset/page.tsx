import { ResetPasswordEmailForm } from './client'
import authStyle from '../auth.layout.module.css'
import style from './reset.module.css'
import Link from 'next/link'
import Divider from '@/components/Divider'
import formStyles from '@styles/formStyles.module.css'
import AuthNavButton from '../_component/AuthNavButton'
import classNames from 'classnames'

export default async function Page() {
  return (
    <div className={authStyle.authContentContainer}>
      <div
        className={classNames(
          authStyle.authNavButtonPositioning,
          style.resetPasswordButtonWrapper
        )}
      >
        <AuthNavButton label="Forgot Password" href="" isActive />
      </div>

      <p className={style.resetInfoParagraph}>
        If you have an account with us we will send you a link to reset your
        password.
      </p>

      <ResetPasswordEmailForm />
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
