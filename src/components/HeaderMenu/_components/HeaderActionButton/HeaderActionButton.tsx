'use client'

import { CircleUserRoundIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Button from '@/components/Button'
import Link from 'next/link'

interface HeaderActionButtonProps {
  name?: string
  sessionIsPresent: boolean
}

/**
 * Renders a button linking to either the user's profile or  the login page.
 *
 * @param {string} name - The name of the user.
 * @param {boolean} sessionIsPresent - Determines whether the user is logged in or not.
 */
export default function HeaderActionButton(
  props: Readonly<HeaderActionButtonProps>
) {
  const { name, sessionIsPresent } = props

  // Get the current pathname
  const pathname = usePathname()

  return (
    <Button
      as={Link}
      href={
        sessionIsPresent
          ? '/profile'
          : `/auth/login${pathname !== '/' ? `?redirect=${pathname}` : ''}`
      }
      icon={<CircleUserRoundIcon />}
      mode="transparent"
    >
      {sessionIsPresent ? name : 'Login'}
    </Button>
  )
}
