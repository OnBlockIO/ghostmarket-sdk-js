export class GetReferralsRequest {
  /** GetReferralsRequest */
  address?: string
  /** Referral id */
  referral_id?: string

  public constructor(init: GetReferralsRequest) {
    ;(<any>Object).assign(this, init)
  }
}
