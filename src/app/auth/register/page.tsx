'use server'
import CreateUserForm from './client'
import Link from 'next/link'
import style from './register.module.css'
import authStyle from '../auth.layout.module.css'
import TextWithDivider from '@/components/TextWithDivider/TextWithDivider'

export default async function Page() {
  return (
    <div className={style.container}>
      <h1 className={authStyle.heading}>Sign Up</h1>

      <CreateUserForm />

      <TextWithDivider>or</TextWithDivider>

      <p className={authStyle.redirectText}>
        Already have an account?{' '}
        <Link className={authStyle.singleAnchor} href={'/auth/login'}>
          Login
        </Link>
      </p>
    </div>
  )
}
