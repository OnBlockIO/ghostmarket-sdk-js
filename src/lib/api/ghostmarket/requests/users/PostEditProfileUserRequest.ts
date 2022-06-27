import { ISignature } from './ISignature'

export interface ISignDataEditProfileUser {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    /** Method */
    method: 'EditUser'

    /** Username (offchain_name) */
    name: string
    /** Title of user */
    title?: string
    /** Issuer short name */
    issuer_short_name?: string
    /** Description */
    description?: string
    /** URL */
    url?: string
    /** Avatar */
    avatar?: string
    /** Banner */
    banner?: string
    /** Socials Facebook */
    socials_facebook?: string
    /** Socials Twitter */
    socials_twitter?: string
    /** Socials Spotify */
    socials_spotify?: string
    /** Socials Youtube */
    socials_youtube?: string
    /** Socials Instagram */
    socials_instagram?: string
    /** Socials Telegram */
    socials_telegram?: string
}

export class PostEditProfileUserRequest {
    /** Signature */
    signature!: ISignature

    /** data signed */
    data!: ISignDataEditProfileUser

    public constructor(init: PostEditProfileUserRequest) {
        ;(<any>Object).assign(this, init)
    }
}
