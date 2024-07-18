'use client'
import styles from './page.module.css'
type DashboardStatContainerType = {
  count: number
  text: string
  icon: JSX.Element
}
export function DashboardStatContainer(
  props: Readonly<DashboardStatContainerType>
) {
  const { count, text, icon } = props
  return (
    <div className={styles.dashboardStatContainer}>
      <div className={styles.dashboardStatInfoWrapper}>
        <div className={styles.dashboardStatIcon}> {icon}</div>{' '}
        <span style={{ fontStyle: 'italic', fontSize: '14px' }}>{text}</span>
      </div>
      <div className={styles.dashboardStatCount}>{count}</div>
    </div>
  )
}