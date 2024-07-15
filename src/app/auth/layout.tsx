import style from './auth.layout.module.css'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className={style.main}>
      <div className={style.container}>{children}</div>
    </main>
  )
}
