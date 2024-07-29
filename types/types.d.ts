type UserAuthObject = {
  passwordHash: String
  passwordSalt: String
}

type ActionResponse = {
  type: 'error' | 'success' | 'idle'
  message: String
}

type VoteCandidate = {
  id: String
  name: String
  imgURL: String // Imgur
}
