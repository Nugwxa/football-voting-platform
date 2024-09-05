'use client'
import { sendResetLink } from '../../action'
import { useFormState } from 'react-dom'
import formStyles from '@styles/formStyles.module.css'
import Required from '@/components/Required'
import SubmitButton from '@/components/SubmitButton'

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

        <SubmitButton
          label="REQUEST PASSWORD RESET"
          actionCondition={true}
          formState={formState}
          isBold
        />
      </form>
    </>
  )
}
