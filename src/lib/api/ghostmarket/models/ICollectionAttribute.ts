export interface ICollectionAttributeValue {
  value_id: number
  value: string
  display_value: string
  count: number
  count_on_sale: number
  count_overall: number
  rarity: number
}

export interface ICollectionAttribute {
  name: string
  name_id: number
  display_name: string
  display_type: string | null
  values: ICollectionAttributeValue[]
}
