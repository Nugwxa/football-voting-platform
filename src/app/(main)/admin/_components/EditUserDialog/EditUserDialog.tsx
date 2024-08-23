'use client'

import { EllipsisVerticalIcon } from 'lucide-react'
import { handleUserEditForm } from './action'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { UserDTO } from '@/lib/user'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import DialogWindow from '@/components/DialogWindow'
import formStyles from '@styles/formStyles.module.css'
import Required from '@/components/Required'
import styles from './EditUserDialog.module.css'
import Switch from '@/components/Switch'

interface EditUserDialogProps {
  user: UserDTO
}

/**
 * A dialog component that allows editing of a user's details.
 *
 * @param {UserDTO} user - The user data to be edited.
 */
export default function EditUserDialog(props: Readonly<EditUserDialogProps>) {
  const { user } = props

  const boundAction = handleUserEditForm.bind(null, user.id)
  const initialState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(boundAction, initialState)

  // State to control the visibility of the dialog window
  const [dialogOpen, setDialogOpen] = useState(false)

  // Effect to close the dialog when the form submission is successful
  useEffect(() => {
    if (formState.type === 'success') {
      setDialogOpen(false)
    }
  }, [formState])
  return (
    <DialogWindow
      key={user.id}
      windowIsOpen={dialogOpen}
      setWindowIsOpen={setDialogOpen}
      windowTitle={`Editing ${user.name}`}
      trigger={
        <Button icon={<EllipsisVerticalIcon />} mode="transparent">
          {null}
        </Button>
      }
    >
      <div className={styles.editUserDialog}>
        <form className={formStyles.form} action={formAction}>
          <div className={formStyles.inputWrapper}>
            <label htmlFor="name">
              Name <Required />
            </label>
            <input
              className={styles.input}
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
              className={styles.input}
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />
          </div>

          {/* Admin and Active status toggles */}
          <div className={styles.inputRow}>
            <div className={formStyles.inputWrapper}>
              <label htmlFor="isAdmin">Admin?</label>
              <div>
                <Switch defaultChecked={user.isAdmin} name="isAdmin" />
              </div>
            </div>

            <div className={formStyles.inputWrapper}>
              <label htmlFor="isActive">Active?</label>
              <div>
                <Switch defaultChecked={user.isActive} name="isActive" />
              </div>
            </div>
          </div>

          <Button type="submit" mode="border" isWide>
            Save Changes
          </Button>
        </form>

        {/* Error message display */}
        {formState.type === 'error' && (
          <ActionCallout responseObj={formState} isWide />
        )}
      </div>
    </DialogWindow>
  )
}
