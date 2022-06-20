/** Deletes an offchain order */
export class PostCreateOrderRequest {
  /** chain */
  chain = ''
  /** token contract */
  token_contract = ''
  /** token id */
  token_id = ''
  /** quote contract */
  quote_contract = ''
  /** quote price */
  quote_price = ''
  /** maker address */
  maker_address = ''
  /** Contract id */
  is_buy_offer = false
  /** start date */
  start_date = 0
  /** end date */
  end_date = 0
  /** signature */
  signature = ''
  /** order key hash */
  order_key_hash = ''
  /** salt */
  salt = ''
  /** origin_fee */
  origin_fees = 0
  /** origin_address */
  origin_address = ''
  /** token amount - how many nfts in order */
  token_amount = 1

  public constructor(init: PostCreateOrderRequest) {
    ;(<any>Object).assign(this, init)
  }
}
