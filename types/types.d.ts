type UserAuthObject = {
  passwordHash: string
  passwordSalt: string
}

type UploadedImage = {
  id: string
  link: string
  deleteHash: string
}

type ActionResponse = {
  type: 'error' | 'success' | 'idle'
  message: string
}
