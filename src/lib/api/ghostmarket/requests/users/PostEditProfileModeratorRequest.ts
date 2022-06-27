import { ISignature } from './ISignature'

export interface ISignDataEditProfileModerator {
    /** Timestamp until when the operation can be performed */
    timestamp: number

    /** Method */
    method: 'ModeratorEditUser'

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

    /** MOD ONLY - user to update */
    user: string
    /** MOD ONLY - reason */
    reason: string
    /** MOD ONLY - verified */
    verified?: boolean
}

export class PostEditProfileModeratorRequest {
    /** Signature */
    signature!: ISignature

    /** data signed */
    data!: ISignDataEditProfileModerator

    public constructor(init: PostEditProfileModeratorRequest) {
        ;(<any>Object).assign(this, init)
    }
}
