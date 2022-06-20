export enum GetUsersRequestVerifiedTypes {
  all = 'all',
  verified = 'yes',
  unverified = 'no',
}

export class GetUsersRequest {
  chain?: string
  /** Order by */
  order_by?: string = 'name'
  /** Order direction */
  order_direction?: string = 'asc'
  /** Offset */
  offset?: number = 0
  /** Limit */
  limit?: number = 25
  /** Name (multiple values supported, comma-separated) */
  offchain_name?: string
  /** Name partial match(multiple values supported, comma-separated) */
  offchain_name_partial?: string
  /** Customer */
  issuer?: string
  /** Address (multiple values supported, comma-separated) */
  address?: string = ''
  /** Return total (slower) or not (faster) */
  with_total?: number = 0
  /** Return only verified users */
  verified?: string = GetUsersRequestVerifiedTypes.all

  public constructor(...inits: Partial<GetUsersRequest>[]) {
    inits.forEach(init => {
      ;(<any>Object).assign(this, init)
    })
  }
}
