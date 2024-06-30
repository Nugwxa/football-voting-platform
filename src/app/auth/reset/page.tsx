import { ResetPasswordEmailForm } from './client'
import authStyle from '../auth.layout.module.css'
import Link from 'next/link'
import TextWithDivider from '@/components/TextWithDivider/TextWithDivider'

export default async function Page() {
  return (
    <div className={authStyle.contentContainer}>
      <h1 className={authStyle.heading}>Reset Password</h1>

      <ResetPasswordEmailForm />

      <TextWithDivider>or</TextWithDivider>

      <p className={authStyle.redirectText}>
        <Link className={authStyle.singleAnchor} href={'/auth/login'}>
          Back To Login
        </Link>
      </p>
    </div>
  )
}
