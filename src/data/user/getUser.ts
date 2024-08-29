'use server'
import { UserDTO } from './types'
import prisma from '@lib/prisma'

type GetUserProps = {
  userId?: string
  userEmail?: string
}

/**
 * Retrieves a single user based on the provided ID or email.
 * * @param {string} userId - The ID of the user to retrieve.
 * @param {string} userEmail - The email of the user to retrieve.
 * @returns {Promise<UserDTO | null>} - The user matching the criteria, or null if not found.
 */
export async function getUser(
  props: Readonly<GetUserProps>
): Promise<UserDTO | null> {
  const { userEmail, userId } = props
  if (!userId && !userEmail) {
    console.error("Either 'userId' or 'userEmail' must be provided.")
    return null
  }
  try {
    const user: UserDTO | null = await prisma.user.findUnique({
      where: {
        id: userId,
        email: userEmail,
      },
      select: {
        email: true,
        id: true,
        isActive: true,
        isAdmin: true,
        name: true,
        registrationDate: true,
      },
    })
    return user
  } catch (e) {
    console.error(
      `User fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return null
  }
}
