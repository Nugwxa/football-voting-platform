'use client'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
import Link from 'next/link'
import React from 'react'
import styles from './HeaderMenu.module.css'

export function NavItem({ item }: { item: { href: string; label: string } }) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(item.href)
  return (
    <Link
      className={classNames(styles.headerAnchor, {
        [styles.activeAnchor]: isActive,
      })}
      href={item.href}
    >
      {item.label}
    </Link>
  )
}

export function LoginButton() {
  const pathname = usePathname()

  return (
    <Link
      className={classNames(styles.actionAnchor)}
      href={`/auth/login?redirect=${pathname}`}
    >
      Login
    </Link>
  )
}
