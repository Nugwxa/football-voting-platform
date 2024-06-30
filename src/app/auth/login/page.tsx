'use server'
import { LoginForm } from './client'
import authStyle from '../auth.layout.module.css'
import Link from 'next/link'

export default async function Page() {
  return (
    <div className={authStyle.contentContainer}>
      <h1>Login</h1>
      <LoginForm />

      <p className={authStyle.redirectText}>
        Forgot Password?{' '}
        <Link className={authStyle.singleAnchor} href={'/auth/reset'}>
          Reset
        </Link>
      </p>

      <p className={authStyle.redirectText}>
        Don't have an account?{' '}
        <Link className={authStyle.singleAnchor} href={'/auth/login'}>
          Register
        </Link>
      </p>
    </div>
  )
}
