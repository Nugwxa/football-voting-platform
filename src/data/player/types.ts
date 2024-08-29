import { $Enums } from '@prisma/client'

export type PlayerDTO = {
  id: string
  key: string
  firstName: string
  lastName: string
  img: UploadedImage | null
  squadNumber: number | null
  position: $Enums.PlayerPositions
  isActive: boolean
}

export interface UpdatePlayerDTO extends Omit<PlayerDTO, 'img'> {
  img: UploadedImage | null | undefined
}

export interface CreatePlayerDTO extends Omit<PlayerDTO, 'id'> {}
