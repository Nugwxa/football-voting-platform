import '@styles/globals.css'
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
  description: 'Vote for your favorite Team 9 players!',

  openGraph: {
    title: 'Team 9 Voting',
    description: 'Vote for your favorite Team 9 players!',
    url: `${process.env.HOST_URL}`,
    siteName: 'Team 9 Voting',
    images: [
      {
        url: `${process.env.HOST_URL}/img/team9_logo.png`,
        width: 500,
        height: 500,
        alt: 'Team 9 Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={classNames(fjallaOne.variable, poppins.variable)}>
        <Theme
          className="themeWrapper"
          accentColor="gold"
          hasBackground={false}
        >
          {children}
        </Theme>
      </body>
    </html>
  )
}
