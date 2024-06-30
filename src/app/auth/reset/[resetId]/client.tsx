'use client'
import { resetPassword } from './action'
import { useFormState } from 'react-dom'
import authStyle from '../../auth.layout.module.css'
import Link from 'next/link'

export function ResetPasswordForm({ resetTokenId }: { resetTokenId: string }) {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }
  const boundAction = resetPassword.bind(null, resetTokenId)
  const [formState, formAction] = useFormState(boundAction, initialFormState)
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
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            name="new-password"
            type="password"
            required
          />
        </div>

        <div className={authStyle.inputWrapper}>
          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
          />
        </div>
        <button
          disabled={authStyle.type === 'success'}
          className={authStyle.button}
          type="submit"
        >
          Reset Password
        </button>
      </form>

      {formState.type === 'success' && (
        <p className={authStyle.redirectText}>
          <Link className={authStyle.singleAnchor} href={'/auth/login'}>
            Back To Login
          </Link>
        </p>
      )}
    </>
  )
}
