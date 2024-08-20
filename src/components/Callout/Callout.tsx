'use client'
import { LucideIcon } from 'lucide-react'
import classNames from 'classnames'
import style from './callout.module.css'

interface CalloutProps extends React.ComponentPropsWithoutRef<'div'> {
  children: string
  className?: string
  icon: LucideIcon
  isWide?: boolean
  title?: string
}

/**
 * Renders a styled callout box.
 *
 * @param {string} className - Additional class name to apply to the callout.
 * @param {string} title - Optional title text to display at the top of the callout.
 * @param {string} children - Text content to display within the callout.
 * @param {LucideIcon} icon - Icon to display in the callout. Must be a LucideIcon component.
 * @param {boolean} isWide - Optional flag to apply wide styling to the callout.
 */
export default function Callout(props: Readonly<CalloutProps>) {
  const {
    children,
    className,
    icon: Icon,
    isWide = false,
    title,
    ...rest
  } = props
  return (
    <div
      className={classNames(className, style.calloutWrapper, {
        [style.isWide]: isWide,
      })}
      {...rest}
    >
      <div className={style.calloutContainer}>
        <div className={style.iconWrapper}>
          <Icon size={16} />
        </div>
        <div className={style.calloutTextSection}>
          <div className={style.calloutTitle}>{title}</div>
          <div className={style.calloutText}>{children}</div>
        </div>
      </div>
    </div>
  )
}
