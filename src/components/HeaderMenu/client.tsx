'use client'
import {
  ChevronRightIcon,
  LogOutIcon,
  MenuIcon,
  User,
  XIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'
import styles from './HeaderMenu.module.css'

type AnchorLink = {
  href: string
  label: string
  viewCondition: boolean
  icon: JSX.Element
}

export function NavItem({ item }: { item: { href: string; label: string } }) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(item.href)
  return (
    <Link
      className={classNames(styles.headerAnchor, {
        [styles.activeAnchor]: isActive,
      })}
      href={item.href}
    >
      {item.label}
    </Link>
  )
}

export function LoginButton() {
  const pathname = usePathname()

  return (
    <Link
      className={classNames(styles.actionAnchor)}
      href={`/auth/login?redirect=${pathname}`}
    >
      Login
    </Link>
  )
}

export function MobileNavigationMenu({
  isAdmin,
  anchorLinks,
  name,
}: {
  isAdmin: boolean
  anchorLinks: AnchorLink[]
  name: string
}) {
  const [isShowing, setIsShowing] = useState<boolean>(false)
  const icon = isShowing ? <XIcon /> : <MenuIcon />
  return (
    <>
      <button
        onClick={() => setIsShowing(!isShowing)}
        className={classNames(styles.button, styles.mobileButton)}
      >
        {icon}
      </button>

      <div
        className={classNames(styles.mobileNavOverlay, {
          [styles.mobileNavIsShowing]: isShowing,
        })}
      >
        <button onClick={() => setIsShowing(false)}></button>
      </div>

      <div
        className={classNames(styles.mobileNavBody, {
          [styles.mobileNavIsShowing]: isShowing,
        })}
      >
        <div className={styles.mobileNavBodyProfileSection}>
          <Link
            href={'/profile'}
            className={styles.mobileNavBodyProfileWrapper}
          >
            <div className={styles.mobileNavBodyProfile}>
              <div className={styles.mobileNavBodyProfileIcon}>
                <User />
              </div>

              <div className={styles.mobileNavBodyProfileInfo}>
                <div className={styles.mobileNavBodyProfileInfoUser}>
                  {name}
                </div>
                <div className={styles.mobileNavBodyProfileInfoRole}>
                  {isAdmin ? 'Admin' : 'Voter'}
                </div>
              </div>
            </div>

            <div className={styles.mobileNavBodyIcon}>
              <ChevronRightIcon />
            </div>
          </Link>
        </div>

        <div className={styles.mobileNavBodyNavigationSection}>
          {anchorLinks.map((link) => {
            if (!link.viewCondition)
              return <Fragment key={link.href}></Fragment>
            return (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavBodyNavigationWrapper}
              >
                <div className={styles.mobileNavBodyNavigationContainer}>
                  <div className={styles.mobileNavBodyNavigationIcon}>
                    {link.icon}
                  </div>
                  <div className={styles.mobileNavBodyNavigationText}>
                    {link.label}
                  </div>
                </div>

                <div>
                  <ChevronRightIcon />
                </div>
              </Link>
            )
          })}

          <button className={styles.mobileNavBodyNavigationWrapper}>
            <div className={styles.mobileNavBodyNavigationContainer}>
              <div className={styles.mobileNavBodyNavigationIcon}>
                <LogOutIcon />
              </div>
              <div className={styles.mobileNavBodyNavigationText}>Logout</div>
            </div>

            <div>
              <ChevronRightIcon />
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
