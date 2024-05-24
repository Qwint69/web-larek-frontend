import { Api, ApiListResponse } from "./base/api";
import { IProduct, IBasketModel, IBasketResponse, IProductResponse } from "../types";

interface IShopApi {
    getProducts: () => Promise<IProductResponse>
    getProduct: (id: string) => Promise<IProduct>
    postOrder: (order: IBasketModel) => Promise<IBasketResponse>
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

    postOrder(order: IBasketModel) {
        return this.post('/order', order).then((data: IBasketResponse) => data)
    }
}