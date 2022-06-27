export interface INftAttribute {
    key: {
        displayName: string
        displayType?: string
        name: string
        nameId: number
    }
    value: {
        count: number
        countOnSale: number
        countOverall: number
        displayValue: string
        rarity: number
        value: string
        valueId: number
    }
}
