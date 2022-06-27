/** Add/edit verified users. */
export class PostUserRequest {
    /** Endpoint password */
    password = ''
    /** Name */
    name = ''
    /** Join date */
    join_date?: string
    /** Description */
    description?: string
    /** URL */
    url?: string
    /** Avatar */
    avatar?: string
    /** Banner */
    banner?: string
    /** Socials facebook */
    socials_facebook?: string
    /** Socials twitter */
    socials_twitter?: string
    /** Socials instagram */
    socials_instagram?: string
    /** Socials telegram */
    socials_telegram?: string
    /** Socials spotify */
    socials_spotify?: string
    /** Socials youtube */
    socials_youtube?: string
    /** Phantasma address */
    address?: string
    /** Clear fields in database (1) or not (0) if they are not passed to this call */
    clear_empty?: number = 0
    /** Operation mode (edit/delete) */
    mode?: 'edit' | 'delete' = 'edit'

    public constructor(init: PostUserRequest) {
        ;(<any>Object).assign(this, init)
        if (init) {
            if (init.description) {
                this.description = encodeURIComponent(init.description.trim())
            }
            if (init.url) {
                this.url = encodeURIComponent(init.url.trim())
            }
            if (init.socials_facebook) {
                this.socials_facebook = encodeURIComponent(init.socials_facebook.trim())
            }
            if (init.socials_twitter) {
                this.socials_twitter = encodeURIComponent(init.socials_twitter.trim())
            }
            if (init.socials_instagram) {
                this.socials_instagram = encodeURIComponent(init.socials_instagram.trim())
            }
            if (init.socials_telegram) {
                this.socials_telegram = encodeURIComponent(init.socials_telegram.trim())
            }
            if (init.socials_spotify) {
                this.socials_spotify = encodeURIComponent(init.socials_spotify.trim())
            }
            if (init.socials_youtube) {
                this.socials_youtube = encodeURIComponent(init.socials_youtube.trim())
            }
        }
    }
}
