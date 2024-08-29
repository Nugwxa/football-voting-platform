'use server'
import { ButtonMode } from '../Button/Button'
import classNames from 'classnames'
import NavItem, { NavLinkType } from './NavItem/NavItem'
import React from 'react'
import style from './NavLinks.module.css'

interface NavLinks extends React.ComponentPropsWithoutRef<'nav'> {
  className?: string
  isBold?: boolean
  links: NavLinkType[]
  mode?: ButtonMode
  styling?: {
    base?: string
    active?: string
  }
}

/**
 * Renders a nav bar with multiple NavItem components.
 *
 * @param {string} className - Additional class names to apply to the nav element.
 * @param {boolean} isBold - Optional flag to bolden link text.
 * @param {NavLink[]} links - An array of NavLink objects representing each navigation item.
 * @param {ButtonMode} mode - The visual mode of the buttons (e.g., 'solid', 'border').
 * @param {Object} styling - Optional styling classes for the link in different states.
 * @param {string} styling.base - Class name for the default state of the nav links.
 * @param {string} styling.active - Class name for the active state of the nav links.
 */
export default async function NavLinks(props: Readonly<NavLinks>) {
  const { className, isBold = false, links, mode, styling, ...rest } = props

  return (
    <nav className={classNames(className, style.nav)} {...rest}>
      <ul>
        {links.map((link) => {
          if (!link.viewCondition) return null

          return (
            <li key={link.href}>
              <NavItem
                {...link}
                mode={mode}
                styling={styling}
                isBold={isBold}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
