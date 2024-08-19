'use client'

import { LucideIcon } from 'lucide-react'
import classNames from 'classnames'
import styles from './Button.module.css'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: string
  className?: string
  icon?: LucideIcon
  isBold?: boolean
  isWide?: boolean
  mode?: 'solid' | 'border'
}

/**
 * A customizable button component that supports icons, bold text, wide styling, and different modes.
 *
 * @param {string} children - The text to display inside the button.
 * @param {string} [className] - Optional additional class names to apply to the button for additional styling.
 * @param {LucideIcon} [icon] - Optional icon component from Lucide to display inside the button.
 * @param {boolean} [isBold=false] - Whether the button text should be bold.
 * @param {boolean} [isWide=false] - Whether the button's width should fill the container.
 * @param {'solid' | 'border'} [mode='solid'] - The style mode of the button; can be 'solid' or 'border'.
 *
 * @returns {JSX.Element} The rendered button element.
 */
export default function Button(props: Readonly<ButtonProps>): JSX.Element {
  const {
    children,
    className,
    icon: Icon,
    isBold = false,
    isWide = false,
    mode = 'solid',
    ...rest
  } = props
  return (
    <button
      className={classNames(className, styles.button, {
        [styles.isWide]: isWide,
        [styles.alternativeButton]: mode === 'border',
        [styles.isBold]: isBold,
      })}
      {...rest}
    >
      {Icon && <Icon size={16} />}

      {children}
    </button>
  )
}
