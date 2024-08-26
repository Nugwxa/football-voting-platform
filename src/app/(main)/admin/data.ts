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

export const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

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
  const positionSet: Set<string> = new Set(positions)

  return positionSet.has(position)
}
