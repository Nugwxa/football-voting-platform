'use client'
import { fetchPlayers, handlePollCreateForm } from './actions'
import { useFormState } from 'react-dom'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import formStyles from '@styles/formStyles.module.css'
import ReactSelectAsync from '@/components/ReactSelectAsync'
import Required from '@/components/Required'

/**
 * Renders a form to create a new poll
 */
export default function CreatePollForm() {
  const initialState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(
    handlePollCreateForm,
    initialState
  )

  const now = new Date().toISOString().slice(0, 16)

  function fetchOptions(inputValue: string) {
    return fetchPlayers(inputValue)
  }
  return (
    <>
      <form className={formStyles.form} action={formAction}>
        <div className={formStyles.inputWrapper}>
          {/* Title */}
          <label htmlFor="title">
            Title <Required />
          </label>
          <input
            className={formStyles.whiteBackground}
            placeholder="MOTM: X vs X"
            id="title"
            name="title"
            type="text"
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
            placeholder="Poll description here"
            name="description"
            id="description"
            required
          ></textarea>
        </div>

        <div className={formStyles.inputRow}>
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
              min={now}
              defaultValue={now}
              required
            />
          </div>

          {/* Cover Image */}

          <div className={formStyles.inputWrapper}>
            <label htmlFor="coverImage">Cover Image</label>
            <input
              id="coverImage"
              className={formStyles.whiteBackground}
              name="coverImage"
              type="file"
              accept="image/png"
            />
          </div>
        </div>

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
            loadOptions={fetchOptions}
          />
        </div>

        <Button type="submit" mode="border" isWide>
          Create Poll
        </Button>

        <ActionCallout responseObj={formState} isWide />
      </form>
    </>
  )
}
