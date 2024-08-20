'use client'
import { sendResetLink } from '../../action'
import { useFormState } from 'react-dom'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import formStyles from '@styles/formStyles.module.css'
import Required from '@/components/Required'

export default function RequestPasswordResetForm() {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(sendResetLink, initialFormState)
  return (
    <>
      <form action={formAction} className={formStyles.form}>
        <div className={formStyles.inputWrapper}>
          <label htmlFor="email">
            Email <Required />
          </label>
          <input id="email" name="email" type="email" required />
        </div>

        <Button
          disabled={formState.type === 'success'}
          type="submit"
          isWide
          isBold
        >
          REQUEST PASSWORD RESET
        </Button>

        <ActionCallout responseObj={formState} isWide />
      </form>
    </>
  )
}
