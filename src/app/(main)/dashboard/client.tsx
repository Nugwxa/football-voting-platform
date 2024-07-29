'use client'
import classNames from 'classnames'
import styles from './page.module.css'
interface DashboardStatContainerProps
  extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  count: number
  text: string
  icon: JSX.Element
}
/**
 * A component that displays a statistical card with an icon, text, and count.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {number} props.count - The value to be displayed.
 * @param {string} props.text - The text label associated with the count.
 * @param {JSX.Element} props.icon - The icon to be displayed alongside the text.
 *
 * @example
 * const exampleIcon = <SomeIconComponent />;
 * return (
 *   <DashboardStatContainer
 *     count={42}
 *     text="Total Users"
 *     icon={exampleIcon}
 *   />
 * );
 *
 * @returns {JSX.Element} The rendered component.
 */
export function DashboardStatContainer(
  props: Readonly<DashboardStatContainerProps>
): JSX.Element {
  const { count, text, icon, className, ...rest } = props
  return (
    <div
      className={classNames(styles.dashboardStatContainer, className)}
      aria-label={`${text}: ${count}`}
      {...rest}
    >
      <div className={styles.dashboardStatInfoWrapper}>
        <div className={styles.dashboardStatIcon} aria-hidden="true">
          {icon}
        </div>{' '}
        <span className={styles.dashboardStatText} aria-live="polite">
          {text}
        </span>
      </div>
      <div className={styles.dashboardStatCount} aria-live="polite">
        {count}
      </div>
    </div>
  )
}
