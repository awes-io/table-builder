# The &lt;table-builder&gt; Component

It is a component of dynamic tables. It uses the global `Vuex` store. Below you will see a visual presentation of this component.

## Components

* **Table Builder**
* [Paginate Builder](./paginate-builder.md)
* [Table Column](./tb-column.md)

## Example of using the component

```html
<table-builder :default="['One', 'Two', 'Three']"
    store-data="table-min">
</table-builder>
```

<div class="vue-example">
<table-builder :default="['One', 'Two', 'Three']"
    store-data="table-min">
</table-builder>
</div>

## Component properties

| Name               | Type            | Default           | Description                                  |
|--------------------|:---------------:|:-----------------:|----------------------------------------------|
| **store-data (*)** | `String`        | `undefined`       | Data identifier in the store                 |
| **default**        | `Array, Object` | `undefined`       | Data for displaying                          |
| **row-url**        | `String`        | `undefined`       | Address for transition when clicking on a row. It could be a template like `http://some.url/{id}`, where `id` will be replaced with the id variable from row data, thus every row may have it's own url to redirect |
| **media-queries**  | `Object`        | `<MQDefault>`     | Object of media expressions for displaying cells |

```javascript

/**
 * @typedef {Object.<string>} MQDefault
 *
 * Each key of the object is a key for `media` property in <tb-column>
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


## Component slots

### No data

```html
<table-builder store-data="table-empty">
    <h2 slot="empty">No data</h2>
</table-builder>
```

<div class="vue-example">
<table-builder store-data="table-empty">
    <h2 slot="empty">No data</h2>
</table-builder>
</div>

Also, when data are not available, the component gets the CSS class `.is-empty`

### Loading state

```html
<table-builder store-data="table-empty">
    <div slot="loader">
        <i class="icon icon-spinner"></i>
        Loading...
    </div>
</table-builder>
```

Also, when the data are loading, the component gets the CSS class `.is-loading`


### Default slot

By default, the slot only accepts the [&lt;tb-column&gt;](./tb-column.md) components to which row data is transferred for displaying. Below you can find the HTML layout of this component.

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-pagination"
>
    <!-- Everything, except <tb-column>, will be skipped  -->
    <h2>Will not render</h2>

    <!-- The content of the transferred data will be displayed by the column name -->
    <tb-column name="name"></tb-column>

    <!-- Change a heading in the header and the markup within the cell -->
    <tb-column name="email" label="Super Email">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>

    <!-- Create a service column -->
    <tb-column name="no-field" label="">
        <template slot-scope="col">
            <button>Kill {{ col.data.name }}</button>
        </template>
    </tb-column>
</table-builder>
```

<div class="vue-example">
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
</div>

### Slot of the list output

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

<div class="vue-example">
<table-builder :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="list-slot">
    <template slot="list" slot-scope="l">
        {{ l.index + 1 }} <strong>{{l.data.name}}</strong> {{l.data.email}}
    </template>
</table-builder>
</div>

By default, the following data are transferred to the slot with the restricted visibility scope:

| Name             | Type      | Description                      |
|------------------|:---------:|----------------------------------|
| **data**         | `any`     | All data for the current **row** |
| **index**        | `Number`  | Row index, starting from 0       |
| **tableData**    | `Array`   | All data of the table            |

### Slot of the hidden column

By default, all columns hidden on the current screen resolution are displayed in the form of a list.

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-hidden-slot"
>
    <tb-column name="name" label="Super Name"></tb-column>

    <!-- visible only on the desktop -->
    <tb-column name="email" media="desktop">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>
</table-builder>
```
<div class="vue-example">
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
</div>

If additional stylization is needed, please use the `hidden` slot.

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-hidden-slot"
>
    <tb-column name="name" label="Super Name"></tb-column>

    <!-- visible only on the desktop -->
    <tb-column name="email" media="desktop">
        <template slot-scope="col">
            <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
        </template>
    </tb-column>

    <!-- your own markup for the hidden column -->
    <template slot="hidden" slot-scope="m">
        <div>
            <h4 v-if="m.matchedMedia.includes('mobile')">Mobile-only heading</h4>
            Phone: <a :href="'mailto:' + m.data.email ">{{ m.data.email }}</a>
        </div>
    </template>
</table-builder>
```

<div class="vue-example">
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
</div>

The following data are transferred to the slot of the hidden column with the restricted visibility scope:

| Name             | Type      | Description                           |
|------------------|:---------:|---------------------------------------|
| **data**         | `Object`  | All **row** data                      |
| **hidden-data**  | `Object`  | Data hidden from the current **row**  |
| **index**        | `Number`  | Row index, starting from 0            |
| **matchedMedia** | `Array`   | Current matches of media expressions  |


### Header and footer slots (from v.1.0.11)

Add static content before and after table

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'},
        {name: 'Third', email: 'third@mail.com'}
    ]"
    store-data="header-footer-slot"
>
    <template slot="header">
        <h3>Employees list</h3>
    </template>
    <template slot="list" slot-scope="l">
        {{ l.index + 1 }} <strong>{{l.data.name}}</strong> {{l.data.email}}
    </template>
    <template slot="footer">
        <p><button>Add<button> one more employee</p>
    </template>
</table-builder>
```

<div class="vue-example">
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'},
        {name: 'Third', email: 'third@mail.com'}
    ]"
    store-data="header-footer-slot"
>
    <template slot="header">
        <h3>Employees list</h3>
    </template>
    <template slot="list" slot-scope="l">
        {{ l.index + 1 }} <strong>{{l.data.name}}</strong> {{l.data.email}}
    </template>
    <template slot="footer">
        <p><button class="btn" type="button">Add<button> one more employee</p>
    </template>
</table-builder>
</div>