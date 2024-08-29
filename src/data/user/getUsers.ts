'use server'
import { Prisma } from '@prisma/client'
import { UserDTO } from './types'
import prisma from '@lib/prisma'

type GetUsersProps = {
  query?: string
  sortKey?: string
  page?: number
  perPage?: number
}

/**
 * Retrieves a list of users based on the provided search criteria.
 * * @param {string} query - The search query to filter users by name or email.
 * @param {string} sortKey - The key used to sort the users.
 * @param {number} page - The page number for pagination. Defaults to 1.
 * @param {number} perPage - The number of users to retrieve per page. Defaults to 10.
 * @returns {Promise<UserDTO[]>} - A list of users matching the criteria.
 */
export async function getUsers(
  props: Readonly<GetUsersProps>
): Promise<UserDTO[]> {
  const { query, sortKey, page = 1, perPage = 10 } = props

  const validPage = page > 0 ? page : 1
  // Calculate the number of users to skip for pagination
  const skip = (validPage - 1) * perPage

  try {
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
      orderBy:
        orderMap[sortKey ?? 'joined-newest'] || orderMap['joined-newest'],
    })
  } catch (e) {
    console.error(
      `User fetch database error: ${e instanceof Error ? e.message : e}`
    )
    return []
  }
}
