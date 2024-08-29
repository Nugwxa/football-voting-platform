'use client'

import { EllipsisVerticalIcon } from 'lucide-react'
import { fetchPlayers } from '@admin/polls/new/_components/CreatePollForm/actions'
import { handlePollEditForm } from './action'
import { PollDTO } from '@/data/poll/types'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import DialogWindow from '@/components/DialogWindow'
import formStyles from '@styles/formStyles.module.css'
import ReactSelectAsync from '@/components/ReactSelectAsync'
import Required from '@/components/Required'
import styles from './EditPollDialog.module.css'
import Switch from '@/components/Switch'

interface EditPollDialogProps {
  poll: PollDTO
}

/**
 * A dialog component that allows editing of a poll's details.
 *
 * @param {PollDTO} player - The poll data to be edited.
 */
export default function EditPollDialog(props: Readonly<EditPollDialogProps>) {
  const { poll } = props

  const boundAction = handlePollEditForm.bind(null, poll.id)
  const initialState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(boundAction, initialState)

  // State to control the visibility of the dialog window
  const [dialogOpen, setDialogOpen] = useState(false)

  const [isUpdatingImage, setIsUpdatingImage] = useState(false)

  // Sync state with player data when dialog is opened
  useEffect(() => {
    setIsUpdatingImage(false)
  }, [dialogOpen])

  // Effect to close the dialog when the form submission is successful
  useEffect(() => {
    if (formState.type === 'success') {
      setDialogOpen(false)
    }
  }, [formState])

  function fetchOptions(inputValue: string) {
    return fetchPlayers(inputValue)
  }
  return (
    <DialogWindow
      key={poll.id}
      windowIsOpen={dialogOpen}
      setWindowIsOpen={setDialogOpen}
      windowTitle={`Editing ${poll.title}`}
      trigger={
        <div style={{ display: 'flex', cursor: 'pointer' }}>
          <EllipsisVerticalIcon />
        </div>
      }
    >
      <div className={styles.editPlayerDialog}>
        <form className={formStyles.form} action={formAction}>
          <div className={formStyles.inputWrapper}>
            {/* Title */}
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              className={formStyles.input}
              placeholder={poll.title}
              id="title"
              name="title"
              type="text"
              defaultValue={poll.title}
              required
            />
          </div>

          {/* Description */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="description">
              Description <Required />
            </label>
            <textarea
              className={formStyles.whiteBackground}
              placeholder={poll.description}
              name="description"
              id="description"
              defaultValue={poll.description}
              required
            ></textarea>
          </div>

          {/* Closing Date */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="closingDate">
              Closing Date <Required />
            </label>
            <input
              id="closingDate"
              className={formStyles.whiteBackground}
              name="closingDate"
              type="datetime-local"
              defaultValue={poll.closesOn.toISOString().slice(0, 16)}
              required
            />
          </div>

          {/* Update Cover */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="isUpdatingCover">Update Cover?</label>
            <div>
              <Switch
                name="isUpdatingCover"
                defaultChecked={isUpdatingImage}
                onChange={(e) => setIsUpdatingImage(e)}
              />
            </div>
          </div>

          {/* Cover Image */}
          {isUpdatingImage && (
            <div className={formStyles.inputWrapper}>
              <label htmlFor="coverImage">Cover Image</label>
              <input
                id="coverImage"
                className={formStyles.input}
                name="coverImage"
                type="file"
                accept="image/png, image/jpeg"
              />
            </div>
          )}

          {/* Players */}
          <div className={formStyles.inputWrapper}>
            <label htmlFor="players">
              Players <Required />
            </label>
            <ReactSelectAsync
              instanceId={'players'}
              id="players"
              name="players"
              placeholder="Select players ..."
              isMulti
              required
              isSearchable={true}
              cacheOptions
              defaultOptions
              defaultValue={
                poll.players.length > 0
                  ? poll.players.map((p) => ({
                      value: p.id,
                      label: `${
                        p.squadNumber ? '#' + p.squadNumber + ' ' : ''
                      }${p.firstName + ' '}${p.lastName} [${p.position}]`,
                    }))
                  : undefined
              }
              loadOptions={fetchOptions}
            />
          </div>

          <Button type="submit" mode="border" isWide>
            Save Changes
          </Button>

          {/* Error message display */}
          {formState.type === 'error' && (
            <ActionCallout responseObj={formState} isWide />
          )}
        </form>
      </div>
    </DialogWindow>
  )
}
