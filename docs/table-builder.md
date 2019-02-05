# Компонент &lt;table-builder&gt;

Компонент динамических таблиц. Регистрирует хранилище `Vuex` в переменной `Vue.prototype.$tableBuilder`

1. [Пример использования компонента](#tb-example)
2. [Свойства компонента](#tb-options)
3. [Слоты компонента](#tb-slots)


## <a name="tb-example"></a> Пример использования компонента

```html
<table-builder :default="['One', 'Two', 'Three']"
    store-data="table-min">
</table-builder>
```

@vue
<table-builder :default="['One', 'Two', 'Three']"
    store-data="table-min">
</table-builder>
@endvue


## <a name="tb-options"></a> Свойства компонента

| Название           | Тип             | По-умолчанию      | Описание                                     |
|--------------------|:---------------:|:-----------------:|----------------------------------------------|
| **store-data (*)** | `String`        | `undefined`       | Идентификатор данных в хранилище             |
| **store-name**     | `String`        | `'$tableBuilder'` | Расположение хранилища с данными             |
| **default**        | `Array, Object` | `undefined`       | Данные для отображения                       |
| **row-url**        | `String`        | `undefined`       | Адрес для перехода при нажатии на ряд        |
| **media-queries**  | `Object`        | `<MQDefault>`     | Объект медиа-выражений для отображения ячеек |

```javascript

/**
 * @typedef {Object.<string>} MQDefault
 *
 * Each key of the object is a key for `media` prop in <tb-column>
 *
 * Each value should be a valid `mediaQueryString` for window.matchMedia
 * https://developer.mozilla.org/ru/docs/Web/API/Window/matchMedia
 */

/**
 * @property AWES_CONFIG.tableBuilder.mediaQueries {MQDefault}
 *
 * Default config
 */

const AWES_CONFIG = {
    tableBuilder: {
        mediaQueries: {
            mobile: '(max-width: 600px)',
            tablet: '(min-width: 601px) and (max-width: 900px)',
            desktop: '(min-width: 901px)'
        }
    }
}
```


## <a name="tb-slots"></a> Слоты компонента

### Нет данных

```html
<table-builder store-data="table-empty">
    <h2 slot="empty">No data</h2>
</table-builder>
```

@vue
<table-builder store-data="table-empty">
    <h2 slot="empty">No data</h2>
</table-builder>
@endvue

### Слот по-умолчанию

Слот по-умолчанию принимает для отображения только компоненты [&lt;tb-column&gt;](./tb-column.md), в которые передаются данные ряда

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-pagination"
>
    <!-- всё, кроме <tb-column> будет пропущено -->
    <h2>Will not render</h2>

    <!-- по имени колонки будет выведено содержимое из переданных данных -->
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

@vue
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-pagination">
    <h2>Will not render</h2>
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
@endvue

### Слот вывода списка

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="list-slot"
>
    <template slot="list" slot-scope="l">
        {{ l.index + 1 }} <strong>{{l.data.name}}</strong> {{l.data.email}}
    </template>
</table-builder>
```

@vue
<table-builder :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="list-slot">
    <template slot="list" slot-scope="l">
        {{ l.index + 1 }} <strong>{{l.data.name}}</strong> {{l.data.email}}
    </template>
</table-builder>
@endvue

В слот по-умолчанию, с ограниценной областью видимости передаются данные

| Название         | Тип       | Описание                         |
|------------------|:---------:|----------------------------------|
| **data**         | `any`     | Все данные для текущего **ряда** |
| **index**        | `Number`  | Индекс ряда, начиная с 0         |
| **tableData**    | `Array`   | Все данные таблицы               |

### Слот скрытой колонки

По-умолчанию все скрытые на текущем разрешении колонки выводятся в виде списка

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-hidden-slot"
>
    <tb-column name="name" label="Super Name"></tb-column>

    <!-- видна только на desktop -->
    <tb-column name="email" media="desktop">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>
</table-builder>
```

@vue
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-hidden-slot">
    <tb-column name="name" label="Super Name"></tb-column>
    <tb-column name="email" media="desktop">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>
</table-builder>
@endvue

Если необходима дополнительная стилизация, то используется слот `hidden`

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-hidden-slot"
>
    <tb-column name="name" label="Super Name"></tb-column>

    <!-- видна только на desktop -->
    <tb-column name="email" media="desktop">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>

    <!-- своя разметка для скрытой колонки -->
    <template slot="hidden" slot-scope="m">
        <div>
            <h4 v-if="m.matchedMedia.includes('mobile')">Mobile-only heading</h4>
            Phone: <a :href="'mailto:' + m.data.email ">{{ m.data.email }}</a>
        </div>
    </template>
</table-builder>
```

@vue
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-hidden-slot">
    <tb-column name="name" label="Super Name"></tb-column>
    <tb-column name="email" media="desktop">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>
    <template slot="hidden" slot-scope="m">
        <div>
            <h4 v-if="m.matchedMedia.includes('mobile')">Mobile-only heading</h4>
            Phone: <a :href="'mailto:' + m.data.email ">{{ m.data.email }}</a>
        </div>
    </template>
</table-builder>
@endvue

В слот скрытой колонки с ограниченной областью видимости передается:

| Название         | Тип       | Описание                              |
|------------------|:---------:|---------------------------------------|
| **data**         | `any`     | Скрытые данные из текущего **ряда**   |
| **index**        | `Number`  | Индекс ряда, начиная с 0              |
| **matchedMedia** | `Array`   | Текущие совпадения из медиа-выражений |