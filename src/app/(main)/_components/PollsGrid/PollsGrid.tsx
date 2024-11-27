'use server'

import { getPolls } from '@/data/poll'
import { PollCardDTO } from '../PollCard/types'
import PollCard from '../PollCard'

interface PollsGridProps {
  page: string | number
  isActive: boolean
  sortKey: string
}

export default async function PollsGrid(props: Readonly<PollsGridProps>) {
  const { page, isActive, sortKey } = props
  const polls = await getPolls({
    page: Number(page),
    isActive,
    sortKey,
  })
  return (
    <>
      {polls.map((poll) => {
        const pollObj: PollCardDTO = {
          id: poll.id,
          imgURL: poll.img?.link,
          closesOn: poll.closesOn,
          title: poll.title,
          description: poll.description,
        }
        return <PollCard key={poll.id} poll={pollObj} />
      })}
    </>
  )
}
