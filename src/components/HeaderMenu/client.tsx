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
import { AnchorLink } from './HeaderMenu'
import { usePathname } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import classNames from 'classnames'
import Link from 'next/link'
import logoutUser from './action'
import React, { Fragment, useState } from 'react'
import styles from './HeaderMenu.module.css'
import userButtonStyle from './HeaderUserButton.module.css'

type NavItemProps = {
  item: Pick<AnchorLink, 'href' | 'label'>
}

/**
 * Renders a nav link
 *
 * @param {Object} item - The navigation link data.
 * @returns {JSX.Element} A styled nav link
 */
export function NavItem(props: Readonly<NavItemProps>): React.JSX.Element {
  // Destructure properties from props
  const { href, label } = props.item
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)
  return (
    <Link
      className={classNames(styles.headerAnchor, {
        [styles.activeAnchor]: isActive,
      })}
      href={href}
    >
      {label}
    </Link>
  )
}

/**
 * A link to the login page that redirects to the current page after login.
 *
 * @returns {JSX.Element} The rendered login button component.
 */
export function LoginButton(): JSX.Element {
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

type MobileNavProps = {
  anchorLinks: AnchorLink[]
  name: string
  isAdmin: boolean
}
/**
 * Renders the mobile navigation menu.
 *
 * @param {boolean} isAdmin - Boolean indicating if the user is an admin.
 * @param {AnchorLink[]} anchorLinks - Array of navigation links for the menu.
 * @param {string} name - The name of the user to display in the profile section.
 * @returns {JSX.Element} The mobile navigation menu.
 */
export function MobileNavigationMenu(
  props: Readonly<MobileNavProps>
): JSX.Element {
  // Destructure properties from props
  const { anchorLinks, name, isAdmin } = props

  const [isShowing, setIsShowing] = useState<boolean>(false)

  // Determine which icon to display based on the state
  const icon = isShowing ? <XIcon /> : <MenuIcon />
  return (
    <>
      {/* Button to toggle the visibility of the mobile navigation menu */}
      <button
        onClick={() => setIsShowing(!isShowing)}
        className={classNames(styles.button, styles.mobileButton)}
      >
        {icon}
      </button>

      {/* Overlay that covers the screen when the menu is showing */}
      <div
        className={classNames(styles.mobileNavOverlay, {
          [styles.mobileNavIsShowing]: isShowing,
        })}
      >
        {/* Button to close the navigation menu if the user clicks the overlay */}
        <button onClick={() => setIsShowing(false)}></button>
      </div>

      {/* Main content of the mobile navigation menu */}
      <div
        className={classNames(styles.mobileNavBody, {
          [styles.mobileNavIsShowing]: isShowing,
        })}
      >
        {/* Profile section*/}
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

        {/* Nav links section*/}

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

          <LogoutButton />
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
            <LogoutButton className={userButtonStyle.link} />
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
      className={classNames(styles.mobileNavBodyNavigationWrapper, {
        [className ?? '']: className,
      })}
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
