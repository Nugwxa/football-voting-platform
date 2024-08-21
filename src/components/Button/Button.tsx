'use client'

import { LucideIcon } from 'lucide-react'
import classNames from 'classnames'
import styles from './Button.module.css'

// Type for the `as` prop, allowing any valid React element type.
type AsProp<T extends React.ElementType> = {
  as?: T
}

export type ButtonMode = 'solid' | 'border' | 'transparent' // I could probably use better names

// Main button props type, combining the `as` prop and omitting the original `as` if it exists.
type ButtonProps<T extends React.ElementType = 'button'> = AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, 'as'> & {
    children: string
    className?: string
    icon?: LucideIcon
    isBold?: boolean
    isWide?: boolean
    mode?: ButtonMode
  }

/**
 * A customizable button component that supports icons, bold text, wide styling, and different modes.
 * This can be used as a button or Link
 *
 * @param {T} as -  The component or element type to render.
 * @param {string} children - The text to display inside the button.
 * @param {string} className - Optional additional class names to apply to the button for additional styling.
 * @param {LucideIcon} icon - Optional icon component from Lucide to display inside the button.
 * @param {boolean} isBold - Whether the button text should be bold.
 * @param {boolean} isWide - Whether the button's width should fill the container.
 * @param {'solid' | 'border'} mode - The style mode of the button; can be 'solid' or 'border'.
 *
 */
export default function Button<T extends React.ElementType = 'button'>(
  props: Readonly<ButtonProps<T>>
): JSX.Element {
  const {
    as: Component = 'button', // Default to 'button' if no `as` prop is provided
    children,
    className,
    icon: Icon,
    isBold = false,
    isWide = false,
    mode = 'solid',
    ...rest
  } = props

  // Ensure TypeScript recognizes `Component` as a valid JSX element type
  const Element = Component as React.ElementType
  return (
    <Element
      className={classNames(className, styles.button, {
        [styles.isWide]: isWide,
        [styles.borderButton]: mode === 'border',
        [styles.transparentButton]: mode === 'transparent',
        [styles.isBold]: isBold,
      })}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </Element>
  )
}
