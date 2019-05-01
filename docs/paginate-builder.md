# The &lt;paginate-builder&gt; Component

## Components

* [Table Builder](./table-builder.md)
* **Paginate Builder**
* [Table Column](./tb-column.md)

It is a component of dynamic forms. It uses the global `Vuex` store.

## Example of using the component

```html
<paginate-builder :meta="{current_page: 1, from: 1, last_page: 12, path: 'https:\/\/local.awes.io\/example-package', per_page: 15, to: 12, total: 12}"></paginate-builder>
```

<paginate-builder :meta="{current_page: 1, from: 1, last_page: 12, path: 'https:\/\/local.awes.io\/example-package', per_page: 15, to: 12, total: 12}"></paginate-builder>


## Component properties

| Name               | Type            | Default           | Description                                  |
|--------------------|:---------------:|:-----------------:|----------------------------------------------|
| **meta**           | `Object`        | `undefined`       | Pagination data                              |
| **scroll-to**      | `String`        | `'body'`          | Element to be scrolled to after you go       |

### Data format for the pagination

```json
{
    "current_page": 1,
    "data": [],
    "from": 1,
    "per_page": 15,
    "to": 12,
    "total": 12
}
```


## Scrolling to the element after changing data

By default, after switching of pagination, the page is scrolled up (in the body `body` element) in *200* milliseconds.

### Globally, for all tables

```html
<head>
    <!-- config -->
    <script>
        const AWES_CONFIG = {
            key: 'YOUR API KEY',
            tableBuilder: {
                scrollTo: '#frame__content', // CSS selector used in document.querySelector
                scrollDuration: 300 // milliseconds, this value is configured only globally for all tables
            }
        }
    </script>
<head>
```


### For a separate table (only the element to which you scroll)

```html
<paginate-builder scroll-to="#my-element"></paginate-builder>
```


### How to disable scrolling

```html
<!-- globally -->
<head>
    <!-- config -->
    <script>
        const AWES_CONFIG = {
            key: 'YOUR API KEY',
            tableBuilder: {
                scrollTo: false
            }
        }
    </script>
<head>

<!-- locally -->
<paginate-builder :scroll-to="false"></paginate-builder>
```
