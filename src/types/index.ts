export interface IProduct {
    id: string
    title: string
    description: string
    price?: number
    image: string
    category: string
}

export interface ProductSelectEvent {
    item: IProduct
}

export interface IProductResponse {
    total: number
    items: IProduct[]
}

export interface IBasketModel {
    items: Map<string, number>

    add(id: string): void
    remove(id: string): void
    hasProduct(product: IProduct): boolean
    getItems(): IProduct[]
    countTotal(): number
    initBasket(): void
    getSummary(): { total: number, items: string[] }
}

export interface IBasketResponse {
    id: string
    total: number
}

export interface ICatalogModel {
    items: IProduct[]

    setItems(items: IProduct[]): void
    getProduct(id: string): IProduct | undefined
}

export interface CatalogChangeEvent {
    items: IProduct[]
}

export interface IFormData {
    payment: string
    address: string
    email: string
    phone: string
}

export type IFormErrors = Partial<Record<keyof IFormData, string>>

export interface IFormModel {
    form: IFormData
    formErrors: IFormErrors

    setField(field: keyof IFormData, value: string): void
    validateFirstForm(): boolean
    validateSecondForm(): boolean
    initForm(): void
    getForm(): IFormData
}
