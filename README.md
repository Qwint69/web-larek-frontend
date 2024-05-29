# Проектная работа "Веб-ларек"
https://github.com/Qwint69/web-larek-frontend

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении
Корзина 

```

export interface IBasketModel {
    items: Map<string, number>

    add(id: string): void
    remove(id: string): void
    hasProduct(product: IProduct): boolean
    getItems(): IProduct[]
    countTotal(): number
    initBasket(): void
    getSummary(): { total: number, items: string[] }
}

```
Получение данных корзины

```

export interface IBasketResponse {
    id: string
    total: number
}

```

Продукт 

```
export interface IProduct {
    id: string
    title: string
    description: string
    price: number
    image: string
    category: string
}

```
Выбор продукта

```
export interface ProductSelectEvent{
    item: IProduct
}

```
Получение данных продукта

```
export interface IProductResponse{
    total: number
    items: IProduct[]
}

```
Каталог товаров

```
interface ICatalogModel {
    items: IProduct[]
    setItems(items: IProduct[]): void
    getProduct(id: string): IProduct
}

```
Изменение каталога товаров

```
export interface CatalogChangeEvent{
    items: IProduct[]
}

```
Форма 

```
export interface IFormModel {
    form: IFormData
    formErrors: IFormErrors

    setField(field: keyof IFormData, value: string): void
    validateFirstForm(): boolean
    validateSecondForm(): boolean
    initForm(): void
    getForm(): IFormData
}

```
Данные формы

```
export interface IFormData {
    payment: string
    address: string
    email: string
    phone: string
}

```

Ошибки заполнения формы

```
export type IFormErrors = Partial<Record<keyof IFormData, string>>

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс View
Абстрактный компонент представляющий собой логику отображения компонентов на экране
Конструктор:
- protected constructor(protected readonly container: HTMLElement) - создает компонент

Методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает `css` класс компонента
- protected setText(element: HTMLElement, value: unknown) - если компонент существует, устанавливает ему свойство `textcontent`
- setDisabled(element: HTMLElement, state: boolean) - блокирует компонент для взаимодействия с пользователем
- protected setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает поля, нужные для отображения картинки
- render(data?: Partial<T>): HTMLElement - визуилизирует компонент

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс Model
Абстрактный компонент отвечающий за базовый код модели данных
Ключевой метод: 
- emitChanges(event: string, payload?: object) - вызывает событие 

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие 

### Слой данных

#### Класс BasketModel
Представляет собой состояние корзины вебсайта и логику взаимодействия с ней.
В полях класса содержатся следующие данные:
- items: Map<string, number> - new Map() - объект, где ключ это id продукта, значение - количество продуктов в корзине

Также в класс входит набор методов:
- add(id: string): void - добавляет в корзину товар с данным id
- remove(id: string): void - убирает товар из корзины с данным id
- hasProduct(product: IProduct): boolean - проверяет есть ли товар в корзине с данным id
- getItems(): IProduct[] - получает массив из товаров
- countTotal(): number - считает общее количество товаров в корзине
- initBasket(): void - обнуляет корзину
- getSummary(): {total: number, items: string[]} - дает общую информацию о содержимом корзины

#### Класс CatalogtModel
Представляет собой состояние каталога товаров на сайте.
В полях класса содержатся следующие данные:
- items: IProduct[] - массив из товаров

Также в класс входит набор методов:
- setItems(items: IProduct[]): void - добавляет товары в каталог
- getProduct(id: string) : IProduct | undefined - достает нужный товар из каталога

#### Класс FormModel
Представляет собой состояние формы.
В полях класса содержатся следующие данные:
- form = {  
       payment: '',
       address: '',
       email: '',
       phone: '',
    } - объект, где ключ это поле для зполнения а значение это знаечение поля
- formErrors: IFormErrors - ошибки заполнения формы  

Также в класс входит набор методов:
- setField(field: keyof IFormData, value: string): void - устанавливает состояние поля
- validateFirstForm(): boolean - валидирует первую форму
- validateSecondForm(): boolean - валидирует вторую форму
- initForm(): void - очищает поля формы
- getForm(): IFormData - собирает все данные из форм

### Слой представления

#### Класс Modal
Представляет собой логику открытия модальных окон
Методы:
- open() - открытие модального окна
- close() - закрытие модального окна
- render() - рендер контента модального окна

#### Класс ProductCard
Представляет собой отображение карточки товара на экране пользователя
Содержит следущие ключевые поля:
- title: string - название 
- description?: string - описание
- image: string - картинка
- price: number - цена
- category: string - категория

#### Класс Page
Отображение страницы на экране пользователя
Поля:
- counter: number - отображения количества товаров, добавленных на страницу
- catalog: HTMLElement[] - отображение списка товаров на странице
- locked: boolean - состояние страницы при открытых и закртых модальных окнах

#### Класс BasketView
Отображение модально окна открытой корзины
Поля:
- items: HTMLElement[] - список товаров в корзине

Методы:
- toogleButtonDiasable(isDisabled: boolean) - отключает кнопку 'оформить'

#### Класс BasketItemView
Отображение товаров в открытом модальном окне корзины
Поля:
- index: number - номер товара
- title: string - название
- price: number - цена

#### Класс Form
Общий класс, описывающий логику отображения всех форм на странице
Поля:
- valid: boolean - валидация полей формы
- errors: string[] - отображение ошибок заполнения

Методы:
- protected onInputChange(field: keyof T, value: string) - изменение отображения полей формы
- render(state: Partial<T> & IFormState) - отображения валидации формы

#### Класс FirstForm
Отображение первой формы
Поля:
- address: string - поле заполнения адреса
- payment: string - полсе выбора оплаты

#### Класс SecondForm
Отображение второй формы
Поля:
- email: string - поле заполнения почты
- phone: string - поле заполнения телефона

#### Класс Success
Отображение модального окна успешно оформленного товара
Поля:
- description: string - количество списаной валюты после оформления покупки

### События приложения

#### Событие catalog:changed
Заполняет страницу списком товаров

#### Событие product:select
Открывает карточку с товаром

#### Событие modal:open
Декативирует страницу вне модального окна

#### Событие modal:close
Разблокирует страницу после закрытия модального окна

#### Собтыие product:add
Добавляет продукт в корзину 

#### Собтыие basket:open
Открывает модальное окно корзины

#### Собтыие product:delete
Удаляет продукт из корзины

#### Собтыие product:checkout
Открывает окно первой формы для заполнения первичных данных (указание способа оплаты и адрес)

#### Собтыие form:proceed
Открывает окно второй формы для заполнения конечных данных пользователя (почта и телефон)

#### Собтыие form:submit
Отправка оформленной опкупки(если все поля были заполнены корректно), обнуление корзины и счетчика товаров в корзине на страницы
Очистка полей формы

#### Событие formErrors:change
Отображение ошибок заполнения формы(Если дынные введены неверно - показывает ошибку)

#### Событие /^order\..*:change/
Меняет поля формы в модели данных