/** Returns attributes of a collection */
export class GetCollectionAttributesRequest {
  /** Collection slug */
  collection_slug = ''

  public constructor(init?: Partial<GetCollectionAttributesRequest>) {
    ;(<any>Object).assign(this, init)
  }
}
