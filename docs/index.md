# Docs must be here ...


## Скролл до элемента: элемент для скролла и скорость прокрутки

По умолчанию после переключения пагинации страница скроллится в самый верх (элемент `body`) за *200* миллисекунд

### Глобально, для всех таблиц

```html
<head>
    <!-- config -->
    <script>
        const AWES_CONFIG = {
            key: 'YOUR API KEY',
            tableBuilder: {
                scrollTo: '#frame__content', // CSS-селектор, используется в document.QuerySelector
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