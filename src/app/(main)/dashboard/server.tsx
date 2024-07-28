'use server'
import { readSession } from '@/lib/session'
import classNames from 'classnames'
import Link from 'next/link'
import prisma from '@lib/prisma'
import tableStyles from '@styles/tableStyles.module.css'

interface UsersTableProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  page: number
  perPage?: number
}

/**
 * Renders a table of users with pagination.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {number} props.page - The current page number for pagination.
 * @param {number} [props.perPage=10] - The number of users to display per page. Defaults to 10.
 * @returns {JSX.Element} A paginated table of users
 */
export default async function UsersTable(
  props: Readonly<UsersTableProps>
): Promise<JSX.Element> {
  const session = await readSession()
  const { className, page, perPage = 10, ...rest } = props
  const validPage = page > 0 ? page : 1
  // Calculate the number of users to skip for pagination
  const skip = (validPage - 1) * perPage

  // Fetch users from the database excluding the current user
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: session?.user.id,
      },
    },
    skip: skip,
    take: perPage,

    orderBy: {
      name: 'asc',
    },
  })
  const usersArePresent = users.length > 0
  return (
    <div className={classNames(tableStyles.container, className)} {...rest}>
      <table>
        <thead className={tableStyles.tableHead}>
          <tr>
            <th className={tableStyles.widerCol} scope="col">
              Name
            </th>
            <th className={tableStyles.widerCol} scope="col">
              Email
            </th>
            <th scope="col">Role</th>
            <th scope="col">Joined</th>
          </tr>
        </thead>
        {/* Render logic */}
        {usersArePresent && (
          <tbody className={tableStyles.tableBody}>
            {users.map((user) => {
              const dateOptions: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }

              return (
                <tr key={user.id}>
                  <td className={tableStyles.wider}>
                    <Link
                      className={tableStyles.mainText}
                      href={`/dashboard/users/${user.id}/`}
                      aria-label={`View profile for ${user.name}`}
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className={tableStyles.wider}>{user.email}</td>
                  <td>{user.isAdmin ? 'Admin' : 'Voter'}</td>
                  <td>
                    {user.registrationDate.toLocaleDateString(
                      'en-US',
                      dateOptions
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        )}
      </table>
      {!usersArePresent && (
        <div className={tableStyles.noResultWrapper}>No User Found</div>
      )}
    </div>
  )
}
