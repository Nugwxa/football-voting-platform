import HeaderMenu from '@/components/HeaderMenu'
import Footer from '@/components/Footer'

export default function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <HeaderMenu />
      <main>{children}</main>
      <Footer />
    </>
  )
}
