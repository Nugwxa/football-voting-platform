'use client'

import { AlertTriangleIcon, CheckIcon } from 'lucide-react'
import Callout from '../Callout'

interface ActionCalloutProps {
  responseObj: ActionResponse
  className?: string
  isWide?: boolean
}

/**
 * Renders a Callout based on the provided action's response status.
 *
 * @param {ActionResponse} responseObj - Object representing the action response, with a type and message.
 * @param {string} className - Additional class name to apply to the callout.
 * @param {boolean} isWide - Optional flag to apply wide styling to the callout.
 *
 * @returns JSX.Element | null - The rendered callout component or null if the response type is 'idle'.
 */
export default function ActionCallout(props: Readonly<ActionCalloutProps>) {
  const { className, isWide = false, responseObj } = props

  // Return nothing if the action is idle (Form hasn't been submitted)
  if (responseObj.type === 'idle') {
    return null
  }

  // Determine if the action was successful or not
  const actionIsSuccessful = responseObj.type === 'success'

  // Set the appropriate icon and theme color based on the action's success or failure
  const calloutIcon = actionIsSuccessful ? CheckIcon : AlertTriangleIcon
  const calloutTheme = actionIsSuccessful ? 'green' : 'red'

  return (
    <Callout
      data-theme={calloutTheme}
      className={className}
      icon={calloutIcon}
      isWide={isWide}
    >
      {responseObj.message}
    </Callout>
  )
}
