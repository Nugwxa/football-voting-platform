'use server'
import { getPolls } from '@/lib/poll'
import classNames from 'classnames'
import EditPollDialog from '../EditPollDialog'
import Link from 'next/link'
import PollTableImage from '../PollTableImage'
import TableSortToggle from '@/components/TableSortToggle'
import tableStyles from '@styles/tableStyles.module.css'

interface PollTableProps extends React.ComponentPropsWithoutRef<'div'> {
  page: number
  query?: string
  sort?: string
}

/**
 * Renders a table of polls with sorting and editing funtionalty.
 *
 * @param {string} className - Additional class name to apply to the table.
 * @param {number} page - The current page number for pagination.
 * @param {string} query - The search query for filtering polls.
 * @param {string} sort - The sorting key for ordering polls.
 */
export default async function PollTable(props: Readonly<PollTableProps>) {
  const { className, page, query, sort, ...rest } = props

  // Fetch polls from the database
  const polls = await getPolls({ page: page, query: query, sortKey: sort })
  const pollsArePresent = polls.length > 0
  return (
    <div className={classNames(tableStyles.container, className)} {...rest}>
      <table>
        <thead className={tableStyles.tableHead}>
          <tr>
            <th scope="col"></th>

            <th scope="col">
              <TableSortToggle
                text="Title"
                topKey="title-az"
                bottomKey="title-za"
              />
            </th>
            <th scope="col">
              <TableSortToggle
                text="Created on"
                topKey="created-date-new-old"
                bottomKey="created-date-old-new"
                defaultToTop
              />
            </th>
            <th scope="col">
              <TableSortToggle
                text="Closes on"
                topKey="close-date-new-old"
                bottomKey="close-date-old-new"
              />
            </th>
            <th scope="col"> </th>
          </tr>
        </thead>

        {/* Conditionally render the table body */}
        {pollsArePresent && (
          <tbody className={tableStyles.tableBody}>
            {polls.map((poll) => {
              return (
                <tr key={poll.id}>
                  <td>
                    <PollTableImage
                      link={`/polls/${poll.id}`}
                      imgUrl={poll.img?.link}
                    />
                  </td>
                  <td style={{ fontWeight: '500' }}>
                    <Link href={`/polls/${poll.id}`}>{poll.title}</Link>
                  </td>
                  <td>
                    <div className={tableStyles.dividedSection}>
                      {poll.createdOn.toDateString()}{' '}
                      <span className={tableStyles.dividedLowerSection}>
                        {poll.createdOn.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={tableStyles.dividedSection}>
                      {poll.closesOn.toDateString()}{' '}
                      <span className={tableStyles.dividedLowerSection}>
                        {poll.closesOn.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </td>

                  <td>
                    <EditPollDialog poll={poll} />{' '}
                  </td>
                </tr>
              )
            })}
          </tbody>
        )}
      </table>

      {/* Display a message if no polls are found */}
      {!pollsArePresent && (
        <div className={tableStyles.noResultWrapper}>No Poll Found</div>
      )}
    </div>
  )
}
