'use server'
import { Prisma } from '@prisma/client'
import prisma from '@lib/prisma'

export type UserDTO = {
  id: string
  name: string
  email: string
  isActive: boolean
  isAdmin: boolean
  registrationDate: Date
}

/**
 * Counts the number of users whose names or emails contain the given query string.
 * @param {string} query - The query string to search for in user names/emails.
 * @returns {Promise<number>} - The number of users matching the query, or -1 if an error occurs.
 */
export async function countUsers(query: Readonly<string>) {
  let userCount = 0

  try {
    userCount = await prisma.user.count({
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      },
    })
  } catch (e) {
    console.error(
      `User count database error: ${e instanceof Error ? e.message : e}`
    )
    return -1
  }

  return userCount
}

type GetUsersProps = {
  query?: string
  sortKey?: string
  page?: number
  perPage?: number
}

/**
 * Retrieves a list of users based on the provided search criteria.
 * @returns {Promise<UserDTO[]>} - A list of users matching the criteria.
 */
export async function getUsers(props: Readonly<GetUsersProps>) {
  const { query, sortKey, page = 1, perPage = 10 } = props

  const validPage = page > 0 ? page : 1
  // Calculate the number of users to skip for pagination
  const skip = (validPage - 1) * perPage

  try {
    let orderBy:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[]
      | undefined

    const orderMap: Record<string, Prisma.UserOrderByWithRelationInput> = {
      'name-az': { name: 'asc' },
      'name-za': { name: 'desc' },
      'email-az': { email: 'asc' },
      'email-za': { email: 'desc' },
      'joined-newest': { registrationDate: 'desc' },
      'joined-oldest': { registrationDate: 'asc' },
    }
    return await prisma.user.findMany({
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      },
      select: {
        email: true,
        id: true,
        isActive: true,
        isAdmin: true,
        name: true,
        registrationDate: true,
      },
      skip: skip,
      take: perPage,
      orderBy: orderMap[sortKey ?? 'name-az'] || orderMap['name-az'],
    })
  } catch (e) {
    console.error(
      `User fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return []
  }
}

type GetUserProps = {
  userId?: string
  userEmail?: string
}

/**
 * Retrieves a single user based on the provided ID or email.
 * @returns {Promise<UserDTO | null>} - The user matching the criteria, or null if not found.
 */
export async function getUser(props: Readonly<GetUserProps>) {
  const { userEmail, userId } = props
  if (!userId && !userEmail) {
    console.error("Either 'userId' or 'userEmail' must be provided.")
    return null
  }
  let user: UserDTO | null = null
  try {
    user = await prisma.user.findUnique({
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
  } catch (e) {
    console.error(
      `User fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return null
  }

  return user
}

/**
 * Updates a user’s information.
 * @param {UpdateUserDTO} updatedUserData - The data to update the user with.
 * @returns {Promise<ActionResponse>} - An object indicating the success or failure of the update operation.
 */
interface UpdateUserDTO extends Omit<UserDTO, 'registrationDate'> {}
export async function updateUser(
  updatedUserData: Readonly<UpdateUserDTO>
): Promise<ActionResponse> {
  const { id, email, name, isActive, isAdmin } = updatedUserData

  const [existingUser, userWithSameEmail] = await Promise.all([
    getUser({ userId: id }),
    email ? getUser({ userEmail: email }) : null,
  ])

  if (!existingUser) {
    return { type: 'error', message: 'Invalid user' }
  }

  if (userWithSameEmail && userWithSameEmail.id !== id) {
    return { type: 'error', message: 'Email already in use' }
  }

  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        name: name,
        isActive: isActive,
        isAdmin: isAdmin,
      },
    })
    return { type: 'success', message: 'User updated!' }
  } catch (e) {
    console.error(
      `User update database error: ${e instanceof Error ? e.message : e}`
    )
    return { type: 'error', message: 'Error updating user' }
  }
}

type CreateUserDTO = {
  id: string
  name: string
  email: string
}

export async function createUser(newUser: CreateUserDTO) {
  // Will complete once SUPABASE has been implemented
}
