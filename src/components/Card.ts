import { ensureElement } from "../utils/utils"
import { View } from "./base/View"

interface IProductCardAction {
    onClick: (event: MouseEvent) => void
}

interface IProductCard {
    title: string
    description?: string
    image: string
    price: number
    category: string
}

export class ProductCard extends View<IProductCard> {
    protected _title: HTMLElement
    protected _description?: HTMLElement
    protected _image: HTMLImageElement
    protected _price: HTMLElement
    protected _category: HTMLElement
    protected _button: HTMLElement

    constructor(protected blockName: string, container: HTMLElement, actions?: IProductCardAction) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container)

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

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}
