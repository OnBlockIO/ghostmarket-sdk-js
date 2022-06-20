/** Returns dev queries results. */
export class GetDevRequest {
  /** Get all available values of given extended property */
  get_extended_values?: string
  /** Base symbol (ex. 'TTRS') */
  symbol?: string

  public constructor(init?: GetDevRequest) {
    ;(<any>Object).assign(this, init)
  }
}
