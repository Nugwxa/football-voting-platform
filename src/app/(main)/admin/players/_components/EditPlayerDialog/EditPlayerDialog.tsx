'use client'

import { EllipsisVerticalIcon } from 'lucide-react'
import { handlePlayerEditForm } from './action'
import { PlayerDTO } from '@/lib/player'
import { positions } from '../../../data'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import DialogWindow from '@/components/DialogWindow'
import formStyles from '@styles/formStyles.module.css'
import ReactSelect from '@/components/ReactSelect'
import Required from '@/components/Required'
import styles from './EditPlayerDialog.module.css'
import Switch from '@/components/Switch'

interface EditPlayerDialogProps {
  player: PlayerDTO
}

/**
 * A dialog component that allows editing of a player's details.
 *
 * @param {PlayerDTO} player - The player data to be edited.
 */
export default function EditPlayerDialog(
  props: Readonly<EditPlayerDialogProps>
) {
  const { player } = props

  const boundAction = handlePlayerEditForm.bind(null, player.id)
  const initialState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(boundAction, initialState)

  // State to control the visibility of the dialog window
  const [dialogOpen, setDialogOpen] = useState(false)

  const [isActive, setIsActive] = useState(player.isActive)
  const [isUpdatingImage, setIsUpdatingImage] = useState(false)

  // Sync state with player data when dialog is opened
  useEffect(() => {
    setIsActive(player.isActive)
    setIsUpdatingImage(false)
  }, [dialogOpen, player.isActive])

  // Effect to close the dialog when the form submission is successful
  useEffect(() => {
    if (formState.type === 'success') {
      setDialogOpen(false)
    }
  }, [formState])
  return (
    <DialogWindow
      key={player.id}
      windowIsOpen={dialogOpen}
      setWindowIsOpen={setDialogOpen}
      windowTitle={`Editing ${player.firstName + ' '}${player.lastName}`}
      trigger={
        <div style={{ display: 'flex' }}>
          <EllipsisVerticalIcon />
        </div>
      }
    >
      <div className={styles.editPlayerDialog}>
        <form className={formStyles.form} action={formAction}>
          <div className={formStyles.inputWrapper}>
            {/* First Name */}
            <label htmlFor="firstName">
              First Name <Required />
            </label>
            <input
              className={styles.input}
              placeholder={player.firstName}
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={player.firstName}
              required
            />
          </div>

          {/* Last Name */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="lastName">
              Last Name <Required />
            </label>
            <input
              placeholder={player.lastName}
              id="lastName"
              className={styles.input}
              name="lastName"
              type="text"
              defaultValue={player.lastName}
              required
            />
          </div>

          {/* Key */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="key">
              Key <Required />
            </label>
            <input
              placeholder={player.key}
              id="key"
              className={styles.input}
              name="key"
              type="text"
              defaultValue={player.key}
              required
            />
          </div>

          {/* Key */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="position">
              Position <Required />
            </label>
            <ReactSelect
              instanceId={'position'}
              id="position"
              name="position"
              options={positions.map((position) => ({
                value: position,
                label: position,
              }))}
              required
              isSearchable={false}
              defaultValue={{ value: player.position, label: player.position }}
            />
          </div>

          {/* Active */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="isActive">Active?</label>
            <div>
              <Switch
                defaultChecked={player.isActive}
                onChange={(e) => setIsActive(e)}
                name="isActive"
              />
            </div>
          </div>

          {isActive && (
            <div className={formStyles.inputWrapper}>
              <label htmlFor="squadNumber">
                Squad Number <Required />
              </label>
              <input
                placeholder={player.squadNumber?.toString()}
                id="squadNumber"
                min={1}
                max={99}
                className={styles.input}
                name="squadNumber"
                type="number"
                defaultValue={player.squadNumber ?? undefined}
                required
              />
            </div>
          )}

          <div className={formStyles.inputWrapper}>
            <label htmlFor="isUpdatingImage">Update Image?</label>
            <div>
              <Switch
                name="isUpdatingImage"
                defaultChecked={isUpdatingImage}
                onChange={(e) => setIsUpdatingImage(e)}
              />
            </div>
          </div>

          {isUpdatingImage && (
            <div className={formStyles.inputWrapper}>
              <label htmlFor="playerImage">Player Image</label>
              <input
                id="playerImage"
                className={styles.input}
                name="playerImage"
                type="file"
                accept="image/png"
              />
            </div>
          )}

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
