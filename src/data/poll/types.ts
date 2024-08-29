import { PlayerDTO } from '@/data/player/types'

export type PollDTO = {
  id: string
  title: string
  description: string
  createdOn: Date
  closesOn: Date
  img: UploadedImage | null
  players: PlayerDTO[]
}

export interface UpdatePollDTO
  extends Omit<PollDTO, 'img' | 'createdOn' | 'players'> {
  img: UploadedImage | null | undefined
  playerIDs: string[]
}

export interface CreatePollDTO
  extends Omit<PollDTO, 'id' | 'players' | 'createdOn'> {
  playerIDs: string[]
}
