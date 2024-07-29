'use client'
import { createUser } from './action'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import authStyle from '../auth.layout.module.css'

export default function CreateUserForm() {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(createUser, initialFormState)

  //   Redirect the user once the their account has been created
  const router = useRouter()
  if (formState.type === 'success') {
    setTimeout(() => {
      router.push('/auth/login')
    }, 5000)
  }

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
          <label htmlFor="name">Name</label>
          <input
            id="name"
            disabled={formState.type === 'success'}
            autoComplete="off"
            name="name"
            type="text"
            required
          />
        </div>

        <div className={authStyle.inputWrapper}>
          <label htmlFor="email">Email</label>
          <input
            disabled={formState.type === 'success'}
            id="email"
            autoComplete="off"
            name="email"
            type="email"
            required
          />
        </div>

        <div className={authStyle.inputWrapper}>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            disabled={formState.type === 'success'}
            name="password"
            type="password"
            required
          />
        </div>

        <div className={authStyle.inputWrapper}>
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            id="confirm_password"
            disabled={formState.type === 'success'}
            name="confirm_password"
            type="password"
            required
          />
        </div>

        <button
          disabled={authStyle.type === 'success'}
          className={authStyle.button}
          type="submit"
        >
          Create Account
        </button>
      </form>
    </>
  )
}
