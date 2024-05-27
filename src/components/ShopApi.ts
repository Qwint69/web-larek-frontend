import { Api, ApiListResponse } from "./base/api";
import { IProduct, IBasketModel, IBasketResponse, IProductResponse, IFormData } from "../types";

interface IShopApi {
    getProducts: () => Promise<IProductResponse>
    getProduct: (id: string) => Promise<IProduct>
    postOrder: (order: IFormData) => Promise<IBasketResponse>
}

export class ShopApi extends Api implements IShopApi {
    readonly cdn: string

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options)

        this.cdn = cdn
    }

    getProducts() {
        return this.get('/product').then((productsResponse: IProductResponse) => {
            return {
                items: productsResponse.items.map((p) => ({
                    ...p, image: this.cdn + p.image
                })),
                total: productsResponse.total
            }
        })
    }

    getProduct(id: string) {
        return this.get('/product/' + id).then((product: IProduct) => ({ ...product, image: this.cdn + product.image }))
    }

    postOrder(order: IFormData) {
        return this.post('/order', order).then((data: IBasketResponse) => data)
    }
}