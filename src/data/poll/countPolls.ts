'use server'
import prisma from '@/lib/prisma'

type CountPollsProps = {
  query?: string
  isActive?: boolean
}
/**
 * Counts the number of polls that match the specified conditions.
 * @param {string} query - The query string to search for in the poll's title/description.
 * @param {boolean} isActive - filter flag to count only active polls(not expired)
 * @returns {Promise<number>} - The number of polls matching the query, or -1 if an error occurs.
 */

export async function countPolls(
  props: Readonly<CountPollsProps>
): Promise<number> {
  const { query, isActive } = props
  try {
    const now = new Date()

    const pollCount = await prisma.poll.count({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          },
          {
            // Polls that haven't reached their closing date
            ...(isActive === true && { closingDate: { gt: now } }),

            // Polls that have already passed their closing date
            ...(isActive === false && { closingDate: { lt: now } }),
          },
        ],
      },
    })
    return pollCount
  } catch (e) {
    console.error(
      `Poll count database error: ${e instanceof Error ? e.message : e}`
    )
    return -1
  }
}
