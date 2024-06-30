'use server'
import { LoginForm } from './client'
import authStyle from '../auth.layout.module.css'

export default async function Page() {
  return (
    <div className={authStyle.contentContainer}>
      <h1>Login</h1>
      <LoginForm />
    </div>
  )
}
