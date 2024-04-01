type UserAuthObject = {
  passwordHash: String
  passwordSalt: String
}

type ActionResponse = {
  type: 'error' | 'errorArray' | 'success' | 'idle'
  message: String
  errors?: String[]
}

type VoteCandidate = {
  id: String
  name: String
  imgURL: String // Imgur
}
