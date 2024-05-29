import { IBasketModel, ICatalogModel, IFormData, IFormErrors, IFormModel, IProduct } from "../types";
import { Model } from "./base/Model";


export class BasketModel extends Model<IBasketModel> {
    items: Map<string, IProduct> = new Map()


    add(product: IProduct): IProduct[] { 
        this.items.set(product.id, product)
        return this.getItems()
    }

    remove(product: IProduct): IProduct[] {
        if (!this.items.has(product.id)) return this.getItems()
        this.items.delete(product.id)
        return this.getItems()
    }

    hasProduct(product: IProduct): boolean {
        return this.items.has(product.id)
    }

    getItems(): IProduct[] {
        return Array.from(this.items.values())
    }

    countTotal(): number {
        return this.getItems().reduce((acc: number, curr: IProduct) => acc + curr.price, 0)
    }

    initBasket(): void {
        this.items = new Map()
    }

    getSummary(): {total: number, items: string[]} {
        return {
            items: this.getItems().map((i) => i.id),
            total: this.countTotal()
        }
    }
}

export class CatalogModel extends Model<ICatalogModel> {
    items: IProduct[] = []

    setItems(items: IProduct[]): void {
        this.items = items
        this.emitChanges('catalog:changed', { items: this.items })
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find((product) => product.id === id)
    }
}

export class FormModel extends Model<IFormModel> {
    form = {
        payment: '',
        address: '',
        email: '',
        phone: '',
    }
    formErrors: IFormErrors

    setField(field: keyof IFormData, value: string): void {
        this.form[field] = value;
    }

    validateFirstForm(): boolean {
        const errors: typeof this.formErrors = {};

        if (!this.form.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.form.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateSecondForm(): boolean {
        const errors: typeof this.formErrors = {}

        if (!this.form.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.form.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    initForm(): void {
        this.formErrors = {}
        this.form = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        }
    }

    getForm(): IFormData {
        return this.form
    }
}

