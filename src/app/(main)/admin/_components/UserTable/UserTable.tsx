'use server'
import { getUsers } from '@/lib/user'
import Badge from '@/components/Badge'
import classNames from 'classnames'
import EditUserDialog from '../EditUserDialog'
import tableStyles from '@styles/tableStyles.module.css'

interface UserTableProps extends React.ComponentPropsWithoutRef<'div'> {
  page: number
  query?: string
}

export default async function UserTable(props: Readonly<UserTableProps>) {
  const { className, page, query, ...rest } = props

  // Fetch users from the database excluding the current user
  const users = await getUsers({ page: page, query: query })
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
            <th scope="col">Status</th>
            <th scope="col">Role</th>
            <th scope="col">Joined</th>
            <th scope="col"></th>
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
                    <EditUserDialog user={user} />
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
