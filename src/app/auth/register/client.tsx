'use client'
import { CreateUser } from './action'
import { useFormState } from 'react-dom'
import style from './register.module.css'

export default function CreateUserForm() {
  const initialFormState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(CreateUser, initialFormState)
  return (
    <>
      <form action={formAction}>
        <div className={style.inputWrapper}>
          <label htmlFor="name">Name</label>
          <input name="name" type="text" required />
        </div>

        <div className={style.inputWrapper}>
          <label htmlFor="email">Email</label>
          <input name="email" type="email" required />
        </div>

        <div className={style.inputWrapper}>
          <label htmlFor="password">Password</label>
          <input name="password" type="password" required />
        </div>

        <div className={style.inputWrapper}>
          <label htmlFor="confirm_password">Confirm Password</label>
          <input name="confirm_password" type="password" required />
        </div>

        <button type="submit">Submit</button>
      </form>

      <div>{formState.message}</div>
    </>
  )
}
