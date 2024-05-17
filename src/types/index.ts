export interface IProduct {
    id: string
    title: string
    description: string
    price: number
    image: string
}
export interface IBasketModel {
    items: Map<string, number>
    add(id: string): void
    remove(id: string): void
}

export interface ICatalogModel {
    items: IProduct[]
    setItems(items: IProduct[]): void
    getProduct(id: string): IProduct | undefined
}

export interface IFormModel {
    payment: string
    address: string
    email: string
    phone: string

    setFirstForm(payment: string, address: string): void
    setSecondForm(email:string, phone: string): void
    isCurrentForm(formNumber: number): boolean
    checkFirstFormValidation(): boolean
    checkSecondFormValidation(): boolean
}