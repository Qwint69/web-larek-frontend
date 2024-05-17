# Проектная работа "Веб-ларек"

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
}

```

Продукт 

```
interface IProduct {
    id: string
    title: string
    description: string
    price: number
    image: string
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
Форма 

```
interface IFormModel {
    payment: string
    address: string
    email: string
    phone: number
}

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс View
Абстрактный компонент представляющий собой логику представления компонентов на экране
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

#### Класс CatalogtModel
Представляет собой отображения каталога товаров на сайте.
В полях класса содержатся следующие данные:
- items: IProduct[] - массив из товаров

Также в класс входит набор методов:
- setItems(items: IProduct[]): void - добавляет товары в каталог
- getProduct(id: string) : IProduct | undefined - достает нужный товар из каталога

#### Класс FormModel
Представляет собой состояние формы.
В полях класса содержатся следующие данные:
- payment: string - поле оплаты
- address: string  - после адреса
- email: string - после почты
- phone: string - после телефона

Также в класс входит набор методов:
- setFirstForm(payment: string, address: string): void - устанавливает состояние первой формы
- setSecondForm(email:string, phone: string): void - устанавливает состояние второй формы
- isCurrentForm(formNumber: number): boolean - проверяет, является ли форма нынешней 
- checkFirstFormValidation(): boolean - проверяет валидность заполнения первой формы
- checkSecondFormValidation(): boolean - валидирует вторую форму