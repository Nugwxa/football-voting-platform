'use client'
import {
  ChevronRightIcon,
  LogOutIcon,
  MenuIcon,
  User,
  UserCircleIcon,
  UserPenIcon,
  XIcon,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import classNames from 'classnames'
import Link from 'next/link'
import logoutUser from './action'
import React, { Fragment, useState } from 'react'
import styles from './HeaderMenu.module.css'
import userButtonStyle from './HeaderUserButton.module.css'

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

export function HeaderUserButton() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.accountButton}>
          <UserCircleIcon size={40} strokeWidth={1.2} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={userButtonStyle.PopoverContent}
          sideOffset={5}
        >
          <div>
            <Popover.Close className={userButtonStyle.PopoverClose}>
              <Link
                href={'/profile'}
                className={classNames(
                  styles.mobileNavBodyNavigationWrapper,
                  userButtonStyle.link
                )}
              >
                <div className={styles.mobileNavBodyNavigationContainer}>
                  <div className={styles.mobileNavBodyNavigationIcon}>
                    <UserPenIcon />
                  </div>
                  <div className={styles.mobileNavBodyNavigationText}>
                    Profile
                  </div>
                </div>

                <div>
                  <ChevronRightIcon />
                </div>
              </Link>
            </Popover.Close>
            <LogoutButton />
          </div>
          <Popover.Arrow className={userButtonStyle.PopoverArrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function LogoutButton({ className }: { className?: string }) {
  const [isPending, setIsPending] = useState(false)
  const pathname = usePathname()

  async function logUserOut() {
    setIsPending(true)

    await logoutUser(pathname)

    setIsPending(false) //Shouldn't be necessary
  }

  return (
    <button
      disabled={isPending}
      onClick={async () => {
        await logUserOut()
      }}
      className={classNames(
        styles.mobileNavBodyNavigationWrapper,
        userButtonStyle.link
      )}
    >
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
  )
}
