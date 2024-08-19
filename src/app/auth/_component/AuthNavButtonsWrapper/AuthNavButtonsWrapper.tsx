'use client'
import { usePathname } from 'next/navigation'
import AuthNavButton from '../AuthNavButton/AuthNavButton'
import classNames from 'classnames'
import style from './AuthNavButtonsWrapper.module.css'

interface AuthNavButtonsWrapperProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
}
export function AuthNavButtonsWrapper(props: AuthNavButtonsWrapperProps) {
  const { className } = props

  const pathname = usePathname()
  //   Filter out empty characters and get the current page
  const currentPage = pathname.split('/').filter(Boolean).pop() ?? ''

  return (
    <div className={classNames(className, style.authNavButtonsWrapper)}>
      <AuthNavButton
        label="SIGN IN"
        href="/auth/login"
        isActive={currentPage === 'login'}
      />
      <AuthNavButton
        label="REGISTER"
        href="/auth/register"
        isActive={currentPage === 'register'}
      />
    </div>
  )
}
