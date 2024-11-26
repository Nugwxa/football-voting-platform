'use client'
import { handleRegistrationForm } from '../../action'
import { useFormState } from 'react-dom'
import formStyles from '@styles/formStyles.module.css'
import Required from '@/components/Required'
import SubmitButton from '@/components/SubmitButton'

interface RegistrationFormProps {
  redirectTo?: string
}
export default function RegistrationForm(
  props: Readonly<RegistrationFormProps>
) {
  const { redirectTo } = props
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const boundAction = handleRegistrationForm.bind(null, redirectTo ?? '/')
  const [formState, formAction] = useFormState(boundAction, initialFormState)

  return (
    <>
      <form action={formAction} className={formStyles.form}>
        <div className={formStyles.inputWrapper}>
          <label htmlFor="name">
            Name <Required />
          </label>
          <input
            id="name"
            disabled={formState.type === 'success'}
            name="name"
            type="text"
            placeholder="John Doe"
            required
          />
        </div>

        <div className={formStyles.inputWrapper}>
          <label htmlFor="email">
            Email <Required />
          </label>
          <input
            disabled={formState.type === 'success'}
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className={formStyles.inputWrapper}>
          <label htmlFor="password">
            Password <Required />
          </label>

          <input
            id="password"
            disabled={formState.type === 'success'}
            name="password"
            type="password"
            required
          />
        </div>

        <div className={formStyles.inputWrapper}>
          <label htmlFor="confirm_password">
            Confirm Password <Required />
          </label>
          <input
            id="confirm_password"
            disabled={formState.type === 'success'}
            name="confirm_password"
            type="password"
            required
          />
        </div>

        <SubmitButton
          label="Register"
          actionCondition={true}
          formState={formState}
          isBold
        />
      </form>
    </>
  )
}
