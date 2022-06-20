export interface IOpenAsset {
  id: number
  start_date: number
  end_date: number
  price: string
  name: string
  description: string
  image: string
  creator: string
  payment_address: string
  quote_symbol: string
  fiat_price: number
  fiat_currency: string
  type: string
  sold_count: number
}
