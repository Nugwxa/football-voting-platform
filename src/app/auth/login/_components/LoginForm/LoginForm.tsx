'use client'
import { loginUser } from '../../action'
import { useFormState } from 'react-dom'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import formStyles from '@styles/formStyles.module.css'
import Link from 'next/link'
import Required from '@/components/Required'

interface LoginFormProps {
  redirectTo?: string
}
export default function LoginForm(props: Readonly<LoginFormProps>) {
  const { redirectTo } = props
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }
  const boundAction = loginUser.bind(null, redirectTo ?? '/')
  const [formState, formAction] = useFormState(boundAction, initialFormState)
  return (
    <>
      <form action={formAction} className={formStyles.form}>
        <div className={formStyles.inputWrapper}>
          <label htmlFor="email">
            Email Address <Required />
          </label>
          <input
            placeholder="your@email.com"
            id="email"
            name="email"
            type="email"
            required
          />
        </div>
        <div className={formStyles.inputWrapper}>
          <label htmlFor="password">
            Password <Required />
          </label>
          <input id="password" name="password" type="password" required />
        </div>

        <div className={formStyles.inputWrapper}>
          <Link className={formStyles.anchorSpan} href={'/auth/reset'}>
            Forgot Password
          </Link>
        </div>

        <Button
          disabled={formState.type === 'success'}
          type="submit"
          isWide
          isBold
        >
          SIGN IN
        </Button>

        <ActionCallout responseObj={formState} isWide />
      </form>
    </>
  )
}
