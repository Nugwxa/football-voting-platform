'use server'
import { NavLinkType } from '../NavLinks/NavItem/NavItem'
import { readSession } from '@/lib/session'
import HeaderActionButton from './_components/HeaderActionButton'
import Image from 'next/image'
import Link from 'next/link'
import NavLinks from '../NavLinks/'
import styles from './HeaderMenu.module.css'

/**
 * Renders the header menu
 */
export default async function HeaderMenu() {
  const session = await readSession()
  const isAdmin = session?.user.isAdmin ?? false
  const anchorLinks: NavLinkType[] = [
    {
      href: '/',
      label: 'Polls',
      viewCondition: true,
      isAbsolutePathMatch: true,
    },

    {
      href: '/players',
      label: 'Players',
      viewCondition: true,
    },
    {
      href: '/admin',
      label: 'Admin',
      viewCondition: isAdmin,
    },
  ]
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.headerTop}>
          <div className={styles.logoArea}>
            <Link className={styles.headerLogoWrapper} href={'/'}>
              <Image
                priority
                sizes="(max-width: 768px) 40px"
                src={'https://imgur.com/a/ypTI7jo'}
                alt="Team 9 Logo"
                fill
              />
            </Link>
          </div>
        </div>
        <div className={styles.headerBottom}>
          <div className={styles.headerLeft}>
            <div className={styles.logoArea}>
              <Link className={styles.headerLogoWrapper} href={'/'}>
                <Image
                  priority
                  sizes="(max-width: 768px) 58px"
                  src={'/img/team9_logo.png'}
                  alt="Team 9 Logo"
                  fill
                />
              </Link>
            </div>

            <NavLinks links={anchorLinks} mode="transparent" />
          </div>
          <div className={styles.headerRight}>
            <HeaderActionButton
              name={session?.user.name}
              sessionIsPresent={session !== null}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
