# Компонент &lt;table-builder&gt;

Компонент динамических таблиц. Регистрирует хранилище `Vuex` в переменной `Vue.prototype.$tableBuilder`

1. [Пример использования компонента](#tb-example)
2. [Свойства компонента](#tb-options)
3. [События компонента](#tb-events)


## <a name="tb-example"></a> Пример использования компонента

```html
<table-builder
    :data="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="table"
>
    <tb-column name="name"></tb-column>
    <tb-column name="email"></tb-column>
</table-builder>
```

@vue
<table-builder
    :data="[
        {name:'First', email:'first@mail.com'},
        {name: 'Second', email: 'second@mail.com'}
    ]"
    store-data="table"
>
    <tb-column name="name"></tb-column>
    <tb-column name="email"></tb-column>
</table-builder>
@endvue


## <a name="tb-options"></a> Свойства компонента


## <a name="tb-events"></a> События компонента