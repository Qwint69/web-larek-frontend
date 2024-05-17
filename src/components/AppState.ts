import { IBasketModel, ICatalogModel, IFormModel, IProduct } from "../types";


export class BasketModel implements IBasketModel {
    items: Map<string, number> = new Map()


    add(id: string): void {
        if (!this.items.has(id)) this.items.set(id, 0)
        this.items.set(id, this.items.get(id)! + 1)
    }
    remove(id: string): void {
        if (!this.items.has(id)) return
        if (this.items.get(id)! > 0) {
            this.items.set(id, this.items.get(id)! - 1)
            if (this.items.get(id) === 0) this.items.delete(id)
        }
    }
}

export class CatalogModel implements ICatalogModel {
    items: IProduct[] = []

    setItems(items: IProduct[]): void {
        this.items = items
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find((product) => product.id === id)
    }
}

export class FormModel implements IFormModel {
    payment: string = ''
    address: string = ''
    email: string = ''
    phone: string = ''

    setFirstForm(payment: string, address: string): void {
        this.payment = payment
        this.address = address
    }

    setSecondForm(email:string, phone: string): void {
        this.email = email
        this.phone = phone
    }

    isCurrentForm(formNumber: number): boolean {
        const currentForm = this.payment && this.address? 2:1
        return currentForm === formNumber
    }

    checkFirstFormValidation(): boolean {
        return !!this.payment && !!this.address 
    }

    checkSecondFormValidation(): boolean {
        return !!this.email && !!this.phone
    }
}