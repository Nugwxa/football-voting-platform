'use client'
import { handleProfileUpdateForm } from '../actions'
import { useFormState } from 'react-dom'
import formStyles from '@styles/formStyles.module.css'
import Required from '@/components/Required'
import SubmitButton from '@/components/SubmitButton'

interface UpdateProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    isAdmin: boolean
  }
}

export default function UpdateProfileForm(
  props: Readonly<UpdateProfileFormProps>
) {
  const { user } = props

  const boundAction = handleProfileUpdateForm.bind(null, user.id, user.isAdmin)
  const initialState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(boundAction, initialState)
  return (
    <form className={formStyles.form} action={formAction}>
      <div className={formStyles.inputWrapper}>
        <label htmlFor="name">
          Name <Required />
        </label>
        <input
          className={formStyles.whiteBackground}
          placeholder={user.name}
          id="name"
          name="name"
          type="text"
          defaultValue={user.name}
          required
        />
      </div>

      <div className={formStyles.inputWrapper}>
        <label htmlFor="email">
          Email Address <Required />
        </label>
        <input
          placeholder={user.email}
          id="email"
          className={formStyles.whiteBackground}
          name="email"
          type="email"
          defaultValue={user.email}
          required
        />
      </div>
      <SubmitButton
        label="Save Changes"
        actionCondition={true}
        formState={formState}
      />
    </form>
  )
}
