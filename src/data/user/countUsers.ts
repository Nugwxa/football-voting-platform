'use server'
import prisma from '@lib/prisma'

/**
 * Counts the number of users whose names or emails contain the given query string.
 * @param {string} query - The query string to search for in user names/emails.
 * @returns {Promise<number>} - The number of users matching the query, or -1 if an error occurs.
 */
export async function countUsers(query = ''): Promise<number> {
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
