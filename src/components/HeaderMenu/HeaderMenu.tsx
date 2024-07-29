import { Fragment } from 'react'
import {
  HeaderUserButton,
  LoginButton,
  MobileNavigationMenu,
  NavItem,
} from './client'
import { LayoutDashboardIcon, VoteIcon } from 'lucide-react'
import { readSession } from '@/lib/session'
import classNames from 'classnames'
import Link from 'next/link'
import styles from './HeaderMenu.module.css'

export type AnchorLink = {
  href: string
  label: string
  viewCondition: boolean
  icon: JSX.Element
}

/**
 * Renders the header menu
 */
export default async function HeaderMenu() {
  const session = await readSession()
  const name = session?.user.name ?? 'null'
  const sessionIsPresent = session !== null
  const isAdmin = session?.user.isAdmin ?? false
  const anchorLinks: AnchorLink[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      viewCondition: isAdmin,
      icon: <LayoutDashboardIcon />,
    },
    {
      href: '/polls',
      label: 'My Polls',
      viewCondition: sessionIsPresent,
      icon: <VoteIcon />,
    },
  ]
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.headerLeft}>
          <div className={styles.logoArea}>
            <Link className={styles.textLogo} href={'/'}>
              Tally Vote
            </Link>
          </div>
          {session && (
            <nav className={styles.headerNav}>
              <ul>
                {anchorLinks.map((anchorLink) => {
                  if (anchorLink.viewCondition)
                    return (
                      <li key={anchorLink.href}>
                        <NavItem item={anchorLink} />
                      </li>
                    )

                  return <Fragment key={anchorLink.href} />
                })}
              </ul>
            </nav>
          )}
        </div>
        <div className={styles.headerRight}>
          {!session ? (
            <div className={styles.actionAnchorWrapper}>
              <LoginButton />
              <Link
                className={classNames(
                  styles.actionAnchor,
                  styles.specialAnchor
                )}
                href={'/auth/register'}
              >
                Register
              </Link>
            </div>
          ) : (
            <>
              <HeaderUserButton />
              <MobileNavigationMenu
                name={name}
                isAdmin={isAdmin}
                anchorLinks={anchorLinks}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
