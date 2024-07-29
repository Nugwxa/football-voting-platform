import HeaderMenu from '@/components/HeaderMenu'
import styles from './page.module.css'

export default async function Home() {
  return (
    <main className={styles.mainn}>
      <HeaderMenu />
    </main>
  )
}
