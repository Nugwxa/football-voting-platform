'use client'
import { CreateUser } from './action'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import authStyle from '../auth.layout.module.css'
import style from './register.module.css'

export default function CreateUserForm() {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
    errors: [],
  }

  const [formState, formAction] = useFormState(CreateUser, initialFormState)

  //   Redirect the user once the their account has been created
  const router = useRouter()
  if (formState.type === 'success') {
    setTimeout(() => {
      console.log('yes')
      router.push('/auth/login')
    }, 5000)
  }

  return (
    <>
      {/* Form Feedback */}
      <div>
        {formState.errors &&
          formState.errors.map((error, index) => {
            return (
              <li className={authStyle.error} key={index}>
                {error}
              </li>
            )
          })}

        {formState.type !== 'errorArray' && formState.type !== 'idle' && (
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
          <input name="name" type="text" required />
        </div>

        <div className={authStyle.inputWrapper}>
          <label htmlFor="email">Email</label>
          <input name="email" type="email" required />
        </div>

        <div className={authStyle.inputWrapper}>
          <label htmlFor="password">Password</label>
          <input name="password" type="password" required />
        </div>

        <div className={authStyle.inputWrapper}>
          <label htmlFor="confirm_password">Confirm Password</label>
          <input name="confirm_password" type="password" required />
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
