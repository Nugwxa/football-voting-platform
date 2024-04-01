type UserAuth = {
  passwordHash: String
  passwordSalt: String
}

type ActionResponse = {
  type: 'error' | 'success'
  message: String
}

type VoteCandidate = {
  id: String
  name: String
  imgURL: String // Imgur
}
