# The &lt;tb-column&gt; Component

It is a component of the column of dynamic tables. It is available for use only within `table-builder`.

## Components

* [Table Builder](./table-builder.md)
* [Paginate Builder](./paginate-builder.md)
* **Table Column**

## Example of using the component

```html
<table-builder
    :default="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="no-pagination"
>
    <!-- The content of the transferred data will be displayed by the column name, if there is -->
    <!-- If the content is not available, the column will be displayed as empty -->
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

## Component properties

| Name         | Type     | Default           | Description                |
|--------------|:--------:|:-----------------:|----------------------------|
| **name (*)** | `String` | `undefined`       | Name of key in the data object |
| **label**    | `String` | `undefined`       | Column caption in the header    |
| **media**    | `String` | `undefined`       | Key of media expressions   |


## Component slots

By default, the following data are transferred to the slot with the restricted visibility scope:

| Name             | Type      | Description                           |
|------------------|:---------:|---------------------------------------|
| **data**         | `any`     | All data for the current **row**      |
| **index**        | `Number`  | Row index, starting from 0            |
| **active**       | `Boolean` | Specifies if the hidden column is visible     |
| **matchedMedia** | `Array`   | Current matches of media expressions |
