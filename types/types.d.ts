type VoteCandidate = {
id: String
name: String
imgURL: String // Imgur
}

type ActionResponse = {
    type: "error" | "success"
    message: String
}