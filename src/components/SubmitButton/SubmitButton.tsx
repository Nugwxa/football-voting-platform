'use client'
import { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import ActionCallout from '../ActionCallout'
import Button from '../Button'
import classNames from 'classnames'

interface SubmitButtonProps {
  className?: string
  label: ReactNode
  mode?: 'border' | 'transparent' | 'solid'
  isWide?: boolean
  isBold?: boolean
  actionCondition: boolean
  formState: ActionResponse
}
export default function SubmitButton(props: Readonly<SubmitButtonProps>) {
  const {
    className,
    mode = 'border',
    isBold = false,
    isWide = true,
    label,
    actionCondition,
    formState,
  } = props
  const { pending } = useFormStatus()
  return (
    <>
      <Button
        className={classNames(className)}
        disabled={pending}
        type="submit"
        mode={mode}
        isBold={isBold}
        isWide={isWide}
      >
        {label}
      </Button>

      {!pending && actionCondition && (
        <ActionCallout responseObj={formState} isWide />
      )}
    </>
  )
}
