import { NavLinkType } from '@/components/NavLinks/NavItem/NavItem'
import { $Enums } from '@prisma/client'

export const adminNavLinks: NavLinkType[] = [
  {
    href: '/admin',
    label: 'Users',
    viewCondition: true,
    isAbsolutePathMatch: true,
  },

  {
    href: '/admin/polls',
    label: 'Polls',
    viewCondition: true,
  },
  {
    href: '/admin/players',
    label: 'Players',
    viewCondition: true,
  },
]

/**
 * Checks if a given position string is a valid player position.
 *
 * @param {string} position - The position string to validate.
 * @returns {position is $Enums.PlayerPositions} - Returns `true` if the
 * position is valid, otherwise `false`.
 */
export function isValidPosition(
  position: string
): position is $Enums.PlayerPositions {
  const positions: Set<string> = new Set([
    'goalkeeper',
    'defender',
    'midfielder',
    'forward',
  ])

  return positions.has(position)
}
