'use server'
import authStyle from '../auth.layout.module.css'
import CreateUserForm from './client'
import Link from 'next/link'
import TextWithDivider from '@/components/TextWithDivider/TextWithDivider'

export default async function Page() {
  return (
    <div className={authStyle.contentContainer}>
      <h1 className={authStyle.heading}>Sign Up</h1>

      <CreateUserForm />

      <TextWithDivider>or</TextWithDivider>

      <p className={authStyle.redirectText}>
        Already have an account?{' '}
        <Link className={authStyle.singleAnchor} href={'/auth/login'}>
          Login
        </Link>
      </p>

      <p className={authStyle.redirectText}>
        Forgot Password?{' '}
        <Link className={authStyle.singleAnchor} href={'/auth/reset'}>
          Reset
        </Link>
      </p>
    </div>
  )
}
