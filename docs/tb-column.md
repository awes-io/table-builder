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
| **sort**     | `String` | `undefined`       | Sort params for column. If empty string is given, default params will be used |


### Sorting values in column

By default, all the columns are not sortable. To create a sortable column, simply pass the `sort` prop to the component

```html
<tb-column name="my_column" sort></tb-column>
```

Thus, default configuration of sortable columns will be used. To overwrite it globally, pass your own config to `AWES_CONFIG.tableBuilder`. The default config is:

```javascript
{
    // ... some other config params
    sort: {
        param: 'orderBy', // <-- GET-param name in browser query string
        ascTemplate: '%s', // <-- template, where '%s' is replaced with column name
        descTemplate: '%s_desc'
    }
}
```

You may overwrite template values for each column, by passing custom values to sort param. Separate them with pipe sign `|`, first is for ascending order, second is for descending.

> Note that param name could not be configured for each column, it is configured globally

```html
<!-- custom param values. Query string will look like: -->
<!-- ...?orderBy=sort-ascending  -->
<!-- ...?orderBy=sort-descending  -->
<tb-column name="my_column" sort="sort-ascending|sort-descending"></tb-column>
```

Sometimes, you may want to show, that by default table is sorted by some column. In this case you should omit the param value for the current column:

```html
<!-- In case, table is sorted ascending by 'first_name' -->
<tb-column name="first_name" sort="|first_name_desc"></tb-column>

<!-- In case, table is sorted descending by 'first_name' -->
<tb-column name="first_name" sort="first_name"></tb-column>
```


## Component slots

By default, the following data are transferred to the slot with the restricted visibility scope:

| Name             | Type      | Description                           |
|------------------|:---------:|---------------------------------------|
| **data**         | `any`     | All data for the current **row**      |
| **index**        | `Number`  | Row index, starting from 0            |
| **active**       | `Boolean` | Specifies if the hidden column is visible     |
| **matchedMedia** | `Array`   | Current matches of media expressions |
