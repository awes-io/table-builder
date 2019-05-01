# The &lt;table-builder&gt; Component

It is a component of dynamic tables. It uses the global `Vuex` store. Below you will see a visual presentation of this component.

## Components

* **Table Builder**
* [Paginate Builder](./paginate-builder.md)
* [Table Column](./tb-column.md)

## Example of using the component

```html
<content-wrapper :default="['One', 'Two', 'Three']">
    <table-builder slot-scope="table" :default="table.data"></table-builder>
</content-wrapper>
```

<div class="vue-example">
    <content-wrapper :default="['One', 'Two', 'Three']">
        <table-builder slot-scope="table" :default="table.data"></table-builder>
    </content-wrapper>
</div>

## Component properties

| Name               | Type            | Default           | Description                                  |
|--------------------|:---------------:|:-----------------:|----------------------------------------------|
| **default**        | `Array, Object` | `undefined`       | Data for displaying                          |
| **list-class**     | `String`        | `int-table__list` | CSS class for wrapper, while rendering table as a list |
| **list-row-class** | `String`        | `int-table__list-row` | CSS class for row, while rendering table as a list |
| **row-url**        | `String`        | `undefined`       | Address for transition when clicking on a row. It could be a template like `http://some.url/{id}`, where `id` will be replaced with the id variable from row data, thus every row may have it's own url to redirect |
| **row-click**      | `Function`      | redirect to row-url| By default, click on a table row redirects window to url, provided in 'row-url' prop. You may overwrite this behaviour. In this function `this` refers to `window` |
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

### Default slot

By default, the slot only accepts the [&lt;tb-column&gt;](./tb-column.md) components to which row data is transferred for displaying. Below you can find the HTML layout of this component.

```html
<content-wrapper 
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]">
    <table-builder slot-scope="table" :default="table.data">
        <!-- Everything, except <tb-column>, will be skipped -->
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
</content-wrapper>
```

<div class="vue-example">
    <content-wrapper 
        :default="[
            {name:'First', email:'first@mail.com'},
            {name: 'Second', email: 'second@mail.com'}
        ]">
        <table-builder slot-scope="table" :default="table.data">
            <h2>Will not render</h2>
            <tb-column name="name"></tb-column>
            <tb-column name="email" label="Super Email">
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
    </content-wrapper>
</div>

### Slot of the list output

```html
<content-wrapper 
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]">
    <table-builder slot-scope="table" :default="table.data">
        <template slot="list" slot-scope="l">
            {{ l.index + 1 }} <strong>{{l.data.name}}</strong> {{l.data.email}}
        </template>
    </table-builder>
</content-wrapper>
```

<div class="vue-example">
    <content-wrapper 
        :default="[
            {name:'First', email:'first@mail.com'},
            {name: 'Second', email: 'second@mail.com'}
        ]">
        <table-builder slot-scope="table" :default="table.data">
            <template slot="list" slot-scope="l">
                {{ l.index + 1 }} <strong>{{l.data.name}}</strong> {{l.data.email}}
            </template>
        </table-builder>
    </content-wrapper>
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
<content-wrapper 
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]">
    <table-builder slot-scope="table" :default="table.data">
        <tb-column name="name" label="Super Name"></tb-column>

        <!-- visible only on the desktop -->
        <tb-column name="email" media="desktop">
            <template slot-scope="col">
                <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
            </template>
        </tb-column>
    </table-builder>
</content-wrapper>
```
<div class="vue-example">
    <content-wrapper 
        :default="[
            {name:'First', email:'first@mail.com'},
            {name: 'Second', email: 'second@mail.com'}
        ]">
        <table-builder slot-scope="table" :default="table.data">
            <tb-column name="name" label="Super Name"></tb-column>
            <tb-column name="email" media="desktop">
                <template slot-scope="col">
                    <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
                </template>
            </tb-column>
        </table-builder>
    </content-wrapper>
</div>

If additional stylization is needed, please use the `hidden` slot.

```html
<content-wrapper 
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]">
    <table-builder slot-scope="table" :default="table.data">
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
                Email: <a :href="'mailto:' + m.data.email ">{{ m.data.email }}</a>
            </div>
        </template>
    </table-builder>
</content-wrapper>
```

<div class="vue-example">
    <content-wrapper 
        :default="[
            {name:'First', email:'first@mail.com'},
            {name: 'Second', email: 'second@mail.com'}
        ]">
        <table-builder slot-scope="table" :default="table.data">
            <tb-column name="name" label="Super Name"></tb-column>
            <tb-column name="email" media="desktop">
                <template slot-scope="col">
                    <a :href="'mailto:' + col.data.email">{{ col.data.email }}</a>
                </template>
            </tb-column>
            <template slot="hidden" slot-scope="m">
                <div>
                    <h4 v-if="m.matchedMedia.includes('mobile')">Mobile-only heading</h4>
                    Email: <a :href="'mailto:' + m.data.email ">{{ m.data.email }}</a>
                </div>
            </template>
        </table-builder>
    </content-wrapper>
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
<content-wrapper 
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'},
        {name: 'Third', email: 'third@mail.com'}
    ]">
    <table-builder slot-scope="table" :default="table.data">
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
</content-wrapper>
```

<div class="vue-example">
    <content-wrapper 
        :default="[
            {name:'First', email:'first@mail.com'},
            {name: 'Second', email: 'second@mail.com'},
            {name: 'Third', email: 'third@mail.com'}
        ]">
        <table-builder slot-scope="table" :default="table.data">
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
    </content-wrapper>
</div>