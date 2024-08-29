'use server'
import { getPlayers } from '@/data/player'
import Badge from '@/components/Badge'
import classNames from 'classnames'
import EditPlayerDialog from '../EditPlayerDialog'
import PlayerTableImage from '../PlayerTableImage'
import TableSortToggle from '@/components/TableSortToggle'
import tableStyles from '@styles/tableStyles.module.css'

interface PlayerTableProps extends React.ComponentPropsWithoutRef<'div'> {
  page: number
  query?: string
  sort?: string
}

/**
 * Renders a table of players with sorting and editing funtionalty.
 *
 * @param {string} className - Additional class name to apply to the table.
 * @param {number} page - The current page number for pagination.
 * @param {string} query - The search query for filtering players.
 * @param {string} sort - The sorting key for ordering players.
 */
export default async function PlayerTable(props: Readonly<PlayerTableProps>) {
  const { className, page, query, sort, ...rest } = props

  // Fetch players from the database
  const players = await getPlayers({ page: page, query: query, sortKey: sort })
  const playersArePresent = players.length > 0
  return (
    <div className={classNames(tableStyles.container, className)} {...rest}>
      <table>
        <thead className={tableStyles.tableHead}>
          <tr>
            <th scope="col"></th>

            <th scope="col">
              <TableSortToggle
                text="Name"
                topKey="name-az"
                bottomKey="name-za"
                defaultToTop
              />
            </th>
            <th scope="col">
              <TableSortToggle
                text="Position"
                topKey="position-az"
                bottomKey="position-za"
              />
            </th>
            <th scope="col">Status</th>
            <th scope="col"> </th>
          </tr>
        </thead>

        {/* Conditionally render the table body */}
        {playersArePresent && (
          <tbody className={tableStyles.tableBody}>
            {players.map((player) => {
              return (
                <tr key={player.id}>
                  <td style={{ maxWidth: '54px' }}>
                    <PlayerTableImage
                      isActive={player.isActive}
                      name={player.lastName}
                      imgUrl={player.img?.link}
                    />
                  </td>
                  <td>
                    {player.firstName + ' '}
                    {player.lastName}
                  </td>
                  <td>{player.position}</td>
                  <td>
                    <Badge data-theme={player.isActive ? 'green' : 'gray'}>
                      {player.isActive ? 'Active' : 'Alumni'}
                    </Badge>
                  </td>

                  <td>
                    <EditPlayerDialog player={player} />{' '}
                  </td>
                </tr>
              )
            })}
          </tbody>
        )}
      </table>

      {/* Display a message if no players are found */}
      {players.length <= 0 && (
        <div className={tableStyles.noResultWrapper}>No Player Found</div>
      )}
    </div>
  )
}
