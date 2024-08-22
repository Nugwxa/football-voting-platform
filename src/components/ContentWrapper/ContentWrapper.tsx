'use server'

import classNames from 'classnames'
import style from './ContentWrapper.module.css'

interface ContentWrapperProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  children: React.ReactNode
}

export default async function ContentWrapper(
  props: Readonly<ContentWrapperProps>
) {
  const { className, children, ...rest } = props

  return (
    <div className={classNames(className, style.contentWrapper)} {...rest}>
      <div className={style.contentContainer}>{children}</div>
    </div>
  )
}
