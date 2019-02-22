# Компонент &lt;paginate-builder&gt;

Компонент динамических форм. Регистрирует хранилище `Vuex` в переменной `AWES._store`

В состоянии загрузки данных с сервера компонент получает CSS-класс `.is-loading`

## Пример использования компонента

```html
<paginate-builder store-data="table" url="test-data.json"></paginate-builder>
```

<paginate-builder store-data="table" url="test-data.json"></paginate-builder>


## Свойства компонента

| Название           | Тип             | По-умолчанию      | Описание                                     |
|--------------------|:---------------:|:-----------------:|----------------------------------------------|
| **store-data (*)** | `String`        | `undefined`       | Идентификатор данных в хранилище             |
| **store-name**     | `String`        | `'$tableBuilder'` | Расположение хранилища с данными             |
| **default**        | `Array, Object` | `undefined`       | Данные пагинации + данные для отображения    |
| **url (*)**        | `String`        | `undefined`       | Адрес для запроса данных                     |
| **scroll-to**      | `String`        | `'body'`          | Элемент, к которому скроллить после перехода |

### Формат данных для пагинации

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


## Скролл до элемента после изменения данных

По умолчанию после переключения пагинации страница скроллится в самый верх (элемент `body`) за *200* миллисекунд

### Глобально, для всех таблиц

```html
<head>
    <!-- config -->
    <script>
        const AWES_CONFIG = {
            key: 'YOUR API KEY',
            tableBuilder: {
                scrollTo: '#frame__content', // CSS-селектор, используется в document.querySelector
                scrollDuration: 300 // миллисекунды, настраивается только глобально для всех таблиц
            }
        }
    </script>
<head>
```


### Для отдельной таблицы (только элемент к которому сколлим)

```html
<paginate-builder scroll-to="#my-element"></paginate-builder>
```


### Для отключения

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