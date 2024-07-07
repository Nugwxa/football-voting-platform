import { Fragment } from 'react'
import { LayoutDashboardIcon, VoteIcon } from 'lucide-react'
import { LoginButton, MobileNavigationMenu, NavItem } from './client'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import readSession from '@/lib/session'
import styles from './HeaderMenu.module.css'
type AnchorLink = {
  href: string
  label: string
  viewCondition: boolean
  icon: JSX.Element
}

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
            <Image
              className={styles.logo}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAARCAMAAAC/+5/SAAAAY1BMVEX///8AAAC9vb2wsLA6OjpSUlLGxsbJyckyMjLf39/X19fo6OisrKy5ubknJycaGhqKioqSkpL5+flZWVl9fX0sLCxHR0fx8fEUFBTPz89CQkJtbW1eXl5oaGhycnJMTEyenp6UHuiQAAABM0lEQVQokZWT6ZaDIAyFExcqijtuba2+/1OWQHDQzsw5vb8uiV8wMQKQhL5X2aOEL5XXiFg1CWLkQ10Zs+gQOSugULGSB1ciaQEonthyKTzk80YrCAyKu4deZBfE2MYwAH+KPOAWgjUXNp1i+8LOGGkCSeoEPWLdk9uaEygsF1nXQIc7g7EvbHzqfQhq5AxxAM/hCmZ/gCOBE0BkOVDIIEvBzi7Nz6ApSK8XuYFOPTUZgDGXJonrjdnBKTcmAquMVNFSqI0cpS49SubkgGr96DFoL19OU22YazCd4HOqAXhb7Auz5tFywtZaj+9YJVZ3kM4NJtYRONjjZjdnp6Foe+l/m6ODRAU0mHHHzOxukfpdlb+BVHnxh5key2cTbXX4d4CIWDCVzkw23nGCOxU6mb/8H9/mCQ0lzHEXEAAAAABJRU5ErkJggg=="
              alt="Logo"
              fill
              priority
            />
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
              <button className={styles.accountButton}>View Profile</button>
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
