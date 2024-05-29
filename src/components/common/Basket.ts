import { ensureElement } from "../../utils/utils";
import { View } from "../base/View";
import { IEvents } from "../base/events";

interface IBasketCardActions {
    onClick: (event: MouseEvent) => void
}

interface IBasketView {
    items: HTMLElement[]
    price: HTMLElement
}

interface IBasketItemView {
    index: number
    title: string
    price: number
}

export class BasketView extends View<IBasketView> {
    protected _items: HTMLElement
    protected _checkout: HTMLButtonElement
    protected _price: HTMLElement

    constructor(container: HTMLElement, protected events: IEvents, actions?: IBasketCardActions) {
        super(container)

        this._items = ensureElement<HTMLElement>('.basket__list', container)
        this._checkout = ensureElement<HTMLButtonElement>('.basket__button', container)
        this._price = ensureElement<HTMLElement>('.basket__price', container)

        if (actions?.onClick) {
            if (this._checkout) {
                this._checkout.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set items(items: HTMLElement[]) {
        this._items.replaceChildren(...items)
    }

    set price(value: number) {
        this.setText(this._price, value)
    }

    toogleButtonDiasable(isDisabled: boolean) {
        this.setDisabled(this._checkout, isDisabled)
    }
}

export class BasketItemView extends View<IBasketItemView> {
    protected _index: HTMLElement
    protected _title: HTMLElement
    protected _price: HTMLElement
    protected _button: HTMLButtonElement

    constructor(container: HTMLElement, events: IEvents, actions?: IBasketCardActions) {
        super(container)

        this._index = ensureElement<HTMLElement>('.basket__item-index', container)
        this._title = ensureElement<HTMLElement>('.card__title', container)
        this._price = ensureElement<HTMLElement>('.card__price', container)
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container)

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set index(value: number) {
        this.setText(this._index, value)
    }

    set title(value: string) {
        this.setText(this._title, value)
    }

    set price(value: number) {
        this.setText(this._price, value)
    }
}