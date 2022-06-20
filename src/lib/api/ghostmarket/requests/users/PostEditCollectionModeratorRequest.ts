import { ISignature } from './ISignature'

export interface ISignDataEditCollectionModerator {
  /** Timestamp until when the operation can be performed */
  timestamp: number

  /** Method */
  method: 'ModeratorEditCollection'

  /** Slug */
  slug: string
  /** Name of collection */
  name?: string
  /** Description */
  description?: string
  /** URL */
  website?: string
  /** Avatar */
  logo_url?: string
  /** Banner */
  featured_image?: string
  /** Background color **/
  background_color?: string
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
  /** Category of collection */
  category?: string

  /** MOD ONLY - reason */
  reason?: string
  /** MOD ONLY - verified */
  verified?: boolean
  /** MOD ONLY - tradable */
  tradable?: boolean
}

export class PostEditCollectionModeratorRequest {
  /** slug */
  slug!: string

  /** signature */
  signature!: ISignature

  /** data signed */
  data!: ISignDataEditCollectionModerator

  public constructor(init: PostEditCollectionModeratorRequest) {
    ;(<any>Object).assign(this, init)
  }
}
