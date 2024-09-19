import Image from 'next/image'
import style from './auth.layout.module.css'
import Footer from '@/components/Footer'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <nav className={style.authNav}>
        <div className={style.authNavLogoWrapper}>
          <Image
            priority
            sizes="(max-width: 768px) 58px"
            src={'https://i.imgur.com/CvH47Tx.png'}
            alt="Team 9 Logo"
            fill
          />
        </div>
      </nav>

      {/* Background Design Section*/}
      <section className={style.authBackgroundSection}>
        {/* Content set from class/css */}
      </section>

      {/* Main  Section*/}
      <main className={style.authMain}>
        {/* Auth Body Container */}
        <div className={style.authBodyContainer}>{children}</div>
      </main>

      <Footer />
    </>
  )
}
