import HeaderMenu from '@/components/HeaderMenu'
import style from './layout.module.css'

export default function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <HeaderMenu />
      <main className={style.bodyWrapper}>
        <div className={style.bodyContainer}>{children}</div>
      </main>
    </>
  )
}
