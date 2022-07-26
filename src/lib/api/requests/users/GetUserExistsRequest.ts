export class GetUserExistsRequest {
    /** Username to check */
    username = ''

    public constructor(init: GetUserExistsRequest) {
        ;(<any>Object).assign(this, init)
    }
}
