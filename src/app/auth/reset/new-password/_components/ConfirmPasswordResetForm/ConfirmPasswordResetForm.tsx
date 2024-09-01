'use client'
import { resetPassword } from '../../action'
import { useFormState } from 'react-dom'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import formStyles from '@styles/formStyles.module.css'
import Required from '@/components/Required'

interface ConfirmPasswordResetFormProps {
  redirectTo?: string
}

/**
 * Renders a form for confirming a new password.
 */
export default function ConfirmPasswordResetForm(
  props: Readonly<ConfirmPasswordResetFormProps>
) {
  const { redirectTo } = props
  // Initial state for the form's action response.
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }
  const boundAction = resetPassword.bind(null, redirectTo ?? '/')
  const [formState, formAction] = useFormState(boundAction, initialFormState)
  return (
    <>
      <form action={formAction} className={formStyles.form}>
        <div className={formStyles.inputWrapper}>
          <label htmlFor="new-password">
            New Password <Required />
          </label>
          <input
            id="new-password"
            name="new-password"
            type="password"
            required
          />
        </div>

        <div className={formStyles.inputWrapper}>
          <label htmlFor="confirm-password">
            Confirm New Password <Required />
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
          />
        </div>

        <Button
          disabled={formState && formState.type === 'success'}
          type="submit"
          isWide
          isBold
        >
          CHANGE PASSWORD
        </Button>

        <ActionCallout responseObj={formState} isWide />
      </form>
    </>
  )
}
