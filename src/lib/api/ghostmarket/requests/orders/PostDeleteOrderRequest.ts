/** Deletes an offchain order */
export class PostDeleteOrderRequest {
  /** key hash of the order to delete */
  orderKeyHash = ''

  public constructor(init: PostDeleteOrderRequest) {
    ;(<any>Object).assign(this, init)
  }
}
