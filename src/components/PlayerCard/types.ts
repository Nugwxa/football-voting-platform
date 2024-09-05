import { $Enums } from '@prisma/client'

export type PlayerCardDTO = {
  firstName: string
  lastName: string
  position: $Enums.PlayerPositions
  imgUrl?: string
  squadNumber: number | null
  isActive?: boolean
}
