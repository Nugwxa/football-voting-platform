'use client'
import classNames from 'classnames'
import Link from 'next/link'
import style from './AuthNavButton.module.css'

interface AuthNavButtonProps extends React.ComponentPropsWithoutRef<'a'> {
  className?: string
  isActive?: boolean
  label: string
  href: string
}
export default function AuthNavButton(props: AuthNavButtonProps) {
  const { className, isActive = false, label, href, ...rest } = props

  return (
    <Link
      className={classNames(className, style.authNavButton, {
        [style.authNavButtonActive]: isActive,
      })}
      href={href}
      {...rest}
    >
      {label}
    </Link>
  )
}
