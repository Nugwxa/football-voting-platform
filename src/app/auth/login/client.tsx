'use client'
import { loginUser } from './action'
import { useFormState } from 'react-dom'
import authStyle from '../auth.layout.module.css'

export function LoginForm() {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(loginUser, initialFormState)
  return (
    <>
      <div>
        {formState.type === 'error' && (
          <p className={authStyle.error}>{formState.message}</p>
        )}
      </div>

      <form action={formAction}>
        <div className={authStyle.inputWrapper}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className={authStyle.inputWrapper}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>

        <button
          disabled={authStyle.type === 'success'}
          className={authStyle.button}
          type="submit"
        >
          Login
        </button>
      </form>
    </>
  )
}
