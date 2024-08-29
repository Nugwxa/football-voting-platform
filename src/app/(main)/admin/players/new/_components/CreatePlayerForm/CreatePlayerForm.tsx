'use client'
import { handlePlayerCreateForm } from './actions'
import { positions } from '@admin/data'
import { useFormState } from 'react-dom'
import { useState } from 'react'
import ActionCallout from '@/components/ActionCallout'
import Button from '@/components/Button'
import formStyles from '@styles/formStyles.module.css'
import ReactSelect from '@/components/ReactSelect'
import Required from '@/components/Required'
import Switch from '@/components/Switch'

/**
 * Renders a form to create a new user
 */
export default function CreatePlayerForm() {
  const initialState: ActionResponse = {
    type: 'idle',
    message: '',
  }

  const [formState, formAction] = useFormState(
    handlePlayerCreateForm,
    initialState
  )

  const [isActive, setIsActive] = useState(true)
  const [isAddingImage, setIsAddingImage] = useState(true)
  return (
    <form className={formStyles.form} action={formAction}>
      <div className={formStyles.inputRow}>
        <div className={formStyles.inputWrapper}>
          {/* First Name */}
          <label htmlFor="firstName">
            First Name <Required />
          </label>
          <input
            className={formStyles.whitebackground}
            placeholder="John"
            id="firstName"
            name="firstName"
            type="text"
            required
          />
        </div>

        {/* Last Name */}
        <div className={formStyles.inputWrapper}>
          <label htmlFor="lastName">
            Last Name <Required />
          </label>
          <input
            placeholder="Doe"
            id="lastName"
            className={formStyles.whitebackground}
            name="lastName"
            type="text"
            required
          />
        </div>
      </div>

      {/* Key */}
      <div className={formStyles.inputWrapper}>
        <label htmlFor="key">
          Key <Required />
        </label>
        <input
          placeholder="john-doe"
          id="key"
          className={formStyles.whitebackground}
          name="key"
          type="text"
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
          isSearchable={false}
        />
      </div>

      {/* Active */}
      <div className={formStyles.inputWrapper}>
        <label htmlFor="isActive">Active?</label>
        <div>
          <Switch
            defaultChecked
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
            placeholder="97"
            id="squadNumber"
            min={1}
            max={99}
            className={formStyles.whitebackground}
            name="squadNumber"
            type="number"
            defaultValue={1}
            required
          />
        </div>
      )}

      <div className={formStyles.inputWrapper}>
        <label htmlFor="isAddingImage">Add Image?</label>
        <div>
          <Switch
            name="isAddingImage"
            defaultChecked={isAddingImage}
            onChange={(e) => setIsAddingImage(e)}
          />
        </div>
      </div>

      {isAddingImage && (
        <div className={formStyles.inputWrapper}>
          <label htmlFor="playerImage">
            Player Image <Required />
          </label>
          <input
            id="playerImage"
            className={formStyles.whitebackground}
            name="playerImage"
            type="file"
            accept="image/png"
            required
          />
        </div>
      )}

      <Button type="submit" mode="border" isWide>
        Create Player
      </Button>

      <ActionCallout responseObj={formState} isWide />
    </form>
  )
}
