'use server'
import { getUsers } from '@/data/user'
import { readSession } from '@/lib/session'
import Badge from '@/components/Badge'
import classNames from 'classnames'
import EditUserDialog from '../EditUserDialog'
import TableSortToggle from '@/components/TableSortToggle'
import tableStyles from '@styles/tableStyles.module.css'

interface UserTableProps extends React.ComponentPropsWithoutRef<'div'> {
  page: number
  query?: string
  sort?: string
}

/**
 * Renders a table of users with sorting and editing funtionalty.
 *
 * @param {string} className - Additional class name to apply to the callout.
 * @param {number} page - The current page number for pagination.
 * @param {string} query - The search query for filtering users.
 * @param {string} sort - The sorting key for ordering users.
 */
export default async function UserTable(props: Readonly<UserTableProps>) {
  const { className, page, query, sort, ...rest } = props

  const session = await readSession()

  if (!session) return null
  // Fetch users from the database excluding the current user
  const users = await getUsers({ page: page, query: query, sortKey: sort })
  const usersArePresent = users.length > 0
  return (
    <div className={classNames(tableStyles.container, className)} {...rest}>
      <table>
        <thead className={tableStyles.tableHead}>
          <tr>
            <th scope="col">
              <TableSortToggle
                text="Name"
                topKey="name-az"
                bottomKey="name-za"
              />
            </th>
            <th scope="col">
              <TableSortToggle
                text="Email"
                topKey="email-az"
                bottomKey="email-za"
              />
            </th>
            <th scope="col">Status</th>
            <th scope="col">Role</th>
            <th scope="col">
              <TableSortToggle
                text="Joined on"
                topKey="joined-newest"
                bottomKey="joined-oldest"
                defaultToTop
              />
            </th>
            <th scope="col"> </th>
          </tr>
        </thead>

        {/* Conditionally render the table body */}
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
                  <td className={tableStyles.wider}>{user.name}</td>
                  <td className={tableStyles.wider}>{user.email}</td>
                  <td>
                    <Badge data-theme={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className={tableStyles.divide}>
                    <Badge>{user.isAdmin ? 'Admin' : 'Voter'}</Badge>
                  </td>
                  <td>
                    {user.registrationDate.toLocaleDateString(
                      'en-US',
                      dateOptions
                    )}
                  </td>

                  <td>
                    {/* Prevent admins from editing the main accont or their accounts */}
                    {(user.email !== process.env.MAIN_EMAIL ||
                      user.id !== session.user.id) && (
                      <EditUserDialog user={user} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        )}
      </table>

      {/* Display a message if no users are found */}
      {!usersArePresent && (
        <div className={tableStyles.noResultWrapper}>No User Found</div>
      )}
    </div>
  )
}
