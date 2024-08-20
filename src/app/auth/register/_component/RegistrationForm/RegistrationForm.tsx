'use client'
import { createUser } from '../../action'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import formStyles from '@styles/formStyles.module.css'
import Required from '@/components/Required'
import Button from '@/components/Button'
import ActionCallout from '@/components/ActionCallout'

export default function RegistrationForm() {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(createUser, initialFormState)

  //   Redirect the user once their account has been created
  const router = useRouter()
  if (formState.type === 'success') {
    setTimeout(() => {
      router.push('/auth/login')
    }, 5000)
  }

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

        <Button
          disabled={formState.type === 'success'}
          type="submit"
          isWide
          isBold
        >
          REGISTER
        </Button>

        <ActionCallout responseObj={formState} isWide />
      </form>
    </>
  )
}
