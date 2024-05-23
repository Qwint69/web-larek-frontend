import { ensureElement } from "../../utils/utils"
import { View } from "../base/View"
import { IEvents } from "../base/events"

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends View<{description: string}> {
    protected _button: HTMLButtonElement
    protected _description: HTMLElement

    constructor(container: HTMLElement, protected events: IEvents, actions?: ISuccessActions) {
        super(container)

        this._description = ensureElement<HTMLElement>('.order-success__description', this.container)
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', this.container)

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set description(description: string) {
        this.setText(this._description, description)
    }
}