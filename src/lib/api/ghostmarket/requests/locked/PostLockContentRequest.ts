export class PostLockContentRequest {
    /** Content to lock or unlock (Base 16) */
    content = ''

    public constructor(init: PostLockContentRequest) {
        ;(<any>Object).assign(this, init)
    }
}
