export type UserDTO = {
  id: string
  name: string
  email: string
  isActive: boolean
  isAdmin: boolean
  registrationDate: Date
}

export interface UpdateUserDTO extends Omit<UserDTO, 'registrationDate'> {}

export type CreateUserDTO = {
  name: string
  email: string
  password: string
}
