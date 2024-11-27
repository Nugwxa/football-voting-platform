'use server'
import styles from './PollCardSkeleton.module.css'

export default async function PollCardSkeleton() {
  return (
    <div className={styles.pollCardSkeleton}>
      <div className={styles.pollCardSkeletonImage}> </div>
      <div className={styles.pollCardSkeletonTitle}></div>
      <div className={styles.pollCardSkeletonText}></div>
    </div>
  )
}
