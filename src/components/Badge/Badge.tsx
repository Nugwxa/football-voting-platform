'use client'
import classNames from 'classnames'
import style from './Badge.module.css'

interface BadgeProps extends React.ComponentPropsWithoutRef<'span'> {}

export default function Badge(props: Readonly<BadgeProps>) {
  const { className, children, ...rest } = props
  return (
    <span className={classNames(className, style.badge)} {...rest}>
      {children}
    </span>
  )
}
