'use client'
import { usePathname } from 'next/navigation'
import AuthNavButton from '../AuthNavButton/AuthNavButton'
import classNames from 'classnames'
import style from './AuthNavButtonsWrapper.module.css'

interface AuthNavButtonsWrapperProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
}
export default function AuthNavButtonsWrapper(
  props: Readonly<AuthNavButtonsWrapperProps>
) {
  const { className, ...rest } = props

  const pathname = usePathname()
  //   Filter out empty characters and get the current page
  const currentPage = pathname.split('/').filter(Boolean).pop()

  return (
    <div
      className={classNames(className, style.authNavButtonsWrapper)}
      {...rest}
    >
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
