import { NavLinkType } from '@/components/NavLinks/NavItem/NavItem'

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
