'use client'

import { useFormStatus } from 'react-dom'
import Button from '../Button'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface SubmitButtonProps {
  className?: string
  label: ReactNode
  mode?: 'border' | 'transparent' | 'solid'
  isWide?: boolean
  isBold?: boolean
  children: JSX.Element
}
export default function SubmitButton(props: Readonly<SubmitButtonProps>) {
  const {
    className,
    children,
    mode = 'border',
    isBold = false,
    isWide = true,
    label,
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

      {!pending && <>{children}</>}
    </>
  )
}
