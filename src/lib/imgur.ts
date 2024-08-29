import imgur from 'imgur'

const ImgurClient = new imgur({ accessToken: process.env.ACCESS_TOKEN })

export default ImgurClient
