import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketModel, FormModel, CatalogModel } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { View } from './components/base/View';
import { ShopApi } from './components/ShopApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { ProductCard } from './components/Card';
import { CatalogChangeEvent, IFormData, IFormModel, IProduct, IProductResponse, ProductSelectEvent } from './types';
import { BasketItemView, BasketView } from './components/common/Basket';
import { FirstForm, Form, SecondForm } from './components/common/Form';
import { Success } from './components/common/Success';

const events = new EventEmitter()
const api = new ShopApi(CDN_URL, API_URL)

//Все шаблоны
const success = ensureElement<HTMLTemplateElement>('#success')
const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasket = ensureElement<HTMLTemplateElement>('#card-basket')
const basket = ensureElement<HTMLTemplateElement>('#basket')
const order = ensureElement<HTMLTemplateElement>('#order')
const contacts = ensureElement<HTMLTemplateElement>('#contacts')

//Модель данных
const catalogData = new CatalogModel({}, events)
const basketData = new BasketModel({}, events)
const formData = new FormModel({}, events)

//Глобальные контейнеры
const page = new Page(document.body, events)
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const firstForm = new FirstForm(cloneTemplate(order), events, {
    onSubmit: () => {
        events.emit('form:proceed')
    }
})
const secondForm = new SecondForm(cloneTemplate(contacts), events, {
    onSubmit: () => {
        events.emit('form:submit')
    }
})
const successModal = new Success(cloneTemplate(success), events, {
    onClick: () => {
        modal.close()
    }
})
const basketElement = new BasketView(cloneTemplate(basket), events, {
    onClick: () => {
        events.emit('product:checkout')
    }
})

//Бизнес логика
events.on<CatalogChangeEvent>('catalog:changed', () => {
    page.catalog = catalogData.items.map((i) => {
        const card = new ProductCard('card', cloneTemplate(cardCatalog), {
            onClick: () => events.emit('product:select', i)
        })
        return card.render({
            title: i.title,
            description: i.description,
            image: i.image,
            price: i.price,
            category: i.category
        })
    })
})

events.on<IProduct>('product:select', (i: IProduct) => {
    const card = new ProductCard('card', cloneTemplate(cardPreview), {
        onClick: () =>
            events.emit('product:add', i)
    })
    modal.render({
        content: card.render({
            title: i.title,
            description: i.description,
            image: i.image,
            price: i.price,
            category: i.category
        })
    })

})

events.on('modal:open', () => {
    page.locked = true
})

events.on('modal:close', () => {
    page.locked = false
})

const renderBasket = (products: IProduct[]) => {

    const basketProductsElements = products.map((p, index) => {
        const basketProductElement = new BasketItemView(cloneTemplate(cardBasket), events, {
            onClick: () => {
                events.emit('product:delete', p)
            }
        })
        return basketProductElement.render({
            index: index + 1,
            title: p.title,
            price: p.price
        })
    })
    basketElement.items = basketProductsElements
    basketElement.price = basketData.countTotal()
    basketElement.toogleButtonDiasable(!products.length)
    modal.render({
        content: basketElement.render()
    })

    page.counter = basketData.getItems().length
}

events.on<IProduct>('product:add', (i: IProduct) => {
    const basketProducts = basketData.add(i)
    renderBasket(basketProducts)
})

events.on('basket:open', () => {
    const basketProducts = basketData.getItems()
    renderBasket(basketProducts)
})

events.on<IProduct>('product:delete', (i: IProduct) => {
    const basketProducts = basketData.remove(i)

    renderBasket(basketProducts)

})

events.on('product:checkout', () => {
     
        modal.render({
            content: firstForm.render({
                address: '',
                payment: '',
                errors: [],
                valid: true
            })
        })
})

events.on('form:proceed', () => {

    if (formData.validateFirstForm()) {
        modal.render({
            content: secondForm.render({
                email: '',
                phone: '',
                errors: [],
                valid: true
            })
        })
    }
})

events.on('form:submit', () => {

    if (formData.validateSecondForm()) {
        api.postOrder({ ...formData.getForm(), ...basketData.getSummary() })
            .then(() => {
                modal.render({
                    content: successModal.render({
                        description: `Списано ${basketData.countTotal()} синапсов`
                    })
                })
                basketData.initBasket()
                formData.initForm()
                page.counter = 0
                basketElement.items = []
            })
            .catch((err) => console.error(err))
    }
})

events.on('formErrors:change', (errors: Partial<IFormData>) => {
    const { email, phone, address, payment } = errors;
    firstForm.valid = !address && !payment
    firstForm.errors = Object.values({ address, payment }).filter(i => !!i).join('; ')
    secondForm.valid = !email && !phone
    secondForm.errors = Object.values({ email, phone }).filter(i => !!i).join('; ')
});

events.on(/^order\..*:change/, (data: { field: keyof IFormData, value: string }) => {
    formData.setField(data.field, data.value);
});

api.getProducts()
    .then((response: IProductResponse) => catalogData.setItems.bind(catalogData)(response.items))
    .catch(err => console.error(err))
