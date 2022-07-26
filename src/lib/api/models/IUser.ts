export interface IUser {
    moderator: boolean
    title: string
    name: string
    join_date: string
    description: string
    verified: boolean
    url: string
    avatar: string
    banner: string
    socials_facebook: string
    socials_twitter: string
    socials_instagram: string
    socials_telegram: string
    socials_spotify: string
    socials_youtube: string
    addresses: [{ chain: string; address: string }]
    offchain_name: string
    offchain_title: string
    follow: number
    followers: number
    likes: number
}
