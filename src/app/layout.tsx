import './globals.css'
import '@radix-ui/themes/styles.css'
import { Fjalla_One, Poppins } from '@next/font/google'
import { Theme } from '@radix-ui/themes'
import classNames from 'classnames'
import type { Metadata } from 'next'

const fjallaOne = Fjalla_One({
  subsets: ['latin'],
  variable: '--font-fjalla-one',
  weight: '400',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Team 9 Voting',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={classNames(fjallaOne.variable, poppins.variable)}>
        <Theme accentColor="brown">{children}</Theme>
      </body>
    </html>
  )
}
