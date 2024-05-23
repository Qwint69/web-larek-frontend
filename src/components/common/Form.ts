import { ensureAllElements, ensureElement } from "../../utils/utils"
import { View } from "../base/View"
import { IEvents } from "../base/events"

interface IFormState {
    valid: boolean
    errors: string[]
}

interface IFormActions {
    onSubmit: (event: MouseEvent) => void
}

export class Form<T> extends View<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`order.${String(field)}:change`, {
            field,
            value
        })
        this.events.emit('formErrors:change', {})
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}

interface IFirstForm {
    address: string
    payment: string

}

export class FirstForm extends Form<IFirstForm> {
    protected _radioButtons: HTMLButtonElement[]
    protected _submitButton: HTMLButtonElement

    constructor(container: HTMLFormElement, events: IEvents, actions?: IFormActions) {
        super(container, events);

        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container)
        this._radioButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container)

        this._radioButtons.forEach((b) => b.addEventListener('click', () => {
            this.onInputChange('payment', b.name)
            if (this._radioButtons.some((e) => e.classList.contains('button_alt-active'))) {
                this._radioButtons.forEach((r) => {
                    r.classList.toggle('button_alt-active')
                })
            } else { b.classList.toggle('button_alt-active') }
        }))

        if (actions?.onSubmit) {
            if (this._submitButton) {
                this._submitButton.addEventListener('click', actions.onSubmit);
            } else {
                container.addEventListener('click', actions.onSubmit);
            }
        }
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

interface ISecondForm {
    email: string
    phone: string
}

export class SecondForm extends Form<ISecondForm> {
    protected _submit: HTMLButtonElement

    constructor(container: HTMLFormElement, events: IEvents, actions?: IFormActions) {
        super(container, events)

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container)

        if (actions?.onSubmit) {
            if (this._submit) {
                this._submit.addEventListener('click', actions.onSubmit);
            } else {
                container.addEventListener('click', actions.onSubmit);
            }
        }
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}

