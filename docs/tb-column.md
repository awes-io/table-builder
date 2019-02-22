# Компонент &lt;tb-column&gt;

Компонент колонки динамических таблиц. Доступен для использования только внутри `table-builder`


## Пример использования компонента

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-pagination"
>
    <!-- по имени колонки будет выведено содержимое из переданных данных, если оно есть -->
    <!-- если содержимого нет, колонка отрисуется пустой -->
    <tb-column name="name"></tb-column>

    <!-- меняем заголовок в шапке и разметку внутри ячейки -->
    <tb-column name="email" label="Super Email">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>

    <!-- создаем служебную колонку -->
    <tb-column name="no-field" label="">
        <template slot-scope="col">
            <button>Kill {{ col.data.name }}</button>
        </template>
    </tb-column>
</table-builder>
```

<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-pagination">
    <tb-column name="name" label="Super Name"></tb-column>
    <tb-column name="email">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>
    <tb-column name="no-field" label="">
        <template slot-scope="col">
            <button>Kill {{ col.data.name }}</button>
        </template>
    </tb-column>
</table-builder>


## Свойства компонента

| Название     | Тип      | По-умолчанию      | Описание                   |
|--------------|:--------:|:-----------------:|----------------------------|
| **name (*)** | `String` | `undefined`       | Имя ключа в объекте данных |
| **label**    | `String` | `undefined`       | Подпись колонки в шапке    |
| **media**    | `String` | `undefined`       | Ключ медиа-выражения       |


## Слоты компонента

В слот по-умолчанию, с ограниценной областью видимости передаются данные

| Название         | Тип       | Описание                              |
|------------------|:---------:|---------------------------------------|
| **data**         | `any`     | Все данные для текущего **ряда**      |
| **index**        | `Number`  | Индекс ряда, начиная с 0              |
| **active**       | `Boolean` | Раскрыта ли скрытая колонка           |
| **matchedMedia** | `Array`   | Текущие совпадения из медиа-выражений |