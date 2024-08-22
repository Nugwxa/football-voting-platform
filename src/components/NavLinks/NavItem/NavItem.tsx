'use client'

import { ButtonMode } from '@/components/Button/Button'
import { usePathname } from 'next/navigation'
import Button from '@/components/Button'
import classNames from 'classnames'
import Link from 'next/link'
import styles from './NavItem.module.css'

interface NavItemProps extends Omit<NavLinkType, 'viewCondition'> {
  styling?: {
    base?: string
    active?: string
  }
}

export interface NavLinkType {
  href: string
  label: string
  viewCondition?: boolean
  isAbsolutePathMatch?: boolean
  mode?: ButtonMode
}
/**
 * Renders a navigation link with styling and active state management.
 *
 * @param {string} href - The URL path to navigate to when the link is clicked.
 * @param {string} label - The text label to display for the link.
 * @param {ButtonMode} mode - The visual mode of the button (e.g., 'solid', 'border').
 * @param {boolean} isAbsolutePathMatch - Flag to determine if the current path must exactly match the href to be considered active.
 * @param {Object} styling - Optional styling classes for the link in different states.
 * @param {string} styling.base - Class name for the default state of the link.
 * @param {string} styling.active - Class name for the active state of the link.
 */
export default function NavItem(
  props: Readonly<NavItemProps>
): React.JSX.Element {
  // Destructure properties from props
  const { href, label, mode, isAbsolutePathMatch, styling } = props

  // Get the current pathname
  const pathname = usePathname()

  // Determine if the link is active based on the current pathname
  let isActive
  if (isAbsolutePathMatch) {
    isActive = pathname === href
  } else {
    isActive = pathname.startsWith(href)
  }
  return (
    <Button
      className={classNames(styling?.base, {
        [styling?.active ?? styles.active]: isActive,
      })}
      as={Link}
      href={href}
      mode={mode}
    >
      {label}
    </Button>
  )
}
