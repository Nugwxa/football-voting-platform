'use client'
import { sendResetLink } from './action'
import { useFormState } from 'react-dom'
import authStyle from '../auth.layout.module.css'

export function ResetPasswordEmailForm() {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(sendResetLink, initialFormState)
  return (
    <>
      <div>
        {formState.type !== 'idle' && (
          <p
            className={
              formState.type === 'error' ? authStyle.error : authStyle.success
            }
          >
            {formState.message}
          </p>
        )}
      </div>

      <form action={formAction}>
        <div className={authStyle.inputWrapper}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <button
          disabled={authStyle.type === 'success'}
          className={authStyle.button}
          type="submit"
        >
          Send Reset Link
        </button>
      </form>
    </>
  )
}
