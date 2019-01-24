<script>
    import { ucFirst } from '../js/modules/fp.js'

    export default {
        name: 'table-builder',
        props: {
            data: {
                type: [Object, Array],
                default: function () { return [] }
            },
            'storeData': {
                type: String,
                require: true
            },
            rowUrl: {
                type: String,
                default: null
            }
        },
        computed: {
            table() {
                this.reset();
                return this.$tableBuilder.state[this.storeData]
            }
        },
        created() {
            this.$tableBuilder.commit('setData', {
                param: this.storeData,
                data: this.data
            });
        },
        data() {
            return {
                ColumnParam: 'name',
                //Table helper component name
                HelperComponent: 'tb-column',
                MobileHelperComponent: 'tb-mobile',
                activeItem: null
            }
        },
        methods: {
            setActiveItem(index, val) {
                if (val) {
                    this.activeItem = index;
                } else {
                    this.reset();
                }
            },
            reset() {
                this.activeItem = null;
            }
        },
        render(h) {

            if (!this.table.length) {

                if (this.$slots.empty) {
                    return h('div', {attrs: {class: 'tf-centerblock'}}, [
                        h('div', {attrs: {class: 'tf-centerblock__cell'}}, [
                            h('div', {attrs: {class: 'tf-infoblock tf-infoblock_center tf-infoblock_smart'}}, this.$slots.empty)
                        ])
                    ])
                }
                return h('div', '');

            }

            //Вывод в виде обычного списка
            if (this.$scopedSlots.default) {
                return h('div', this.table.map(data => {
                        return h('div', this.$scopedSlots.default(data));
                    })
                );
            }

            //Формируем заголовки таблиц и шаблоны колонок
            const tableOptions = this.$slots.default.filter(item => {
                return ( item.componentOptions && item.componentOptions.tag === this.HelperComponent )
            }).map(item => {
                return Object.assign({}, item.componentOptions.propsData, {
                    scopedSlots: (item.data.scopedSlots && item.data.scopedSlots.default) ? item.data.scopedSlots.default : null
                });
            });

            let mobileOptions = undefined;
            this.$slots.default.some(item => {
                return ( item.componentOptions && item.componentOptions.tag === this.MobileHelperComponent )
                    ? ((mobileOptions = item), true) : false;
            });

            return h('div', {attrs: {class: 'int-table'}}, [
                h('table', {attrs: {class: 'int-table__table'}}, [
                    h('thead', [
                        //Выводим заголовки таблицы
                        h('tr', [
                            tableOptions.map(item => {
                                return h('th',  {class: [item.className]}, ucFirst(item[this.ColumnParam]))
                            }),
                            h('th')
                        ])
                    ]),
                    h('tbody',
                        //Проходим по данным таблицы
                        this.table.map( (data, index) => {
                            let tbRow = h('tb-row', {
                                    props: {
                                        tableOptions: tableOptions,
                                        data: data,
                                        index: index,
                                        active: (this.activeItem === index),
                                        url: this.rowUrl
                                    },
                                    on: {
                                        setActive: this.setActiveItem
                                    }
                                }
                            );
                            let tbMobile = h('tb-mobile', {
                                props: {
                                    mobileOptions: mobileOptions,
                                    countRows: tableOptions.length
                                }
                            });
                            return [tbRow, tbMobile];
                        })
                    )
                ])
            ]);//End render
        }
    }
</script>
