'use client'

import Button from '@/components/Button'
import { handleLogoutUser } from '../actions'

export default function LogoutButton() {
  async function handleClick() {
    await handleLogoutUser()
  }
  return (
    <Button onClick={handleClick} data-theme="red" mode="border" isWide>
      Logout
    </Button>
  )
}
