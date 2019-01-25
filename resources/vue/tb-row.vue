<script>
    export default {
        name: 'tb-row',
        props: {
            data: {
                type: Object,
                require: true
            },
            tableOptions: {
                type: Array,
                require: true
            },
            index: {
                type: Number,
                require: true
            },
            active: {
                type: Boolean,
                default: false
            },
            url: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                ColumnParam: 'name'
            }
        },
        methods: {
            getCell(data, option) {
                return option.scopedSlots ? option.scopedSlots(data) : this.data[option[this.ColumnParam]]
            },
            setActive(event) {
                event.preventDefault();
                event.stopPropagation();
                this.$emit('setActive', this.index, !this.active);
            },
            goTo(event) {//TODO: Подумать над реализацией
                let isToggle = event.target.classList.contains('int-table__show');
                if (this.url && !isToggle) {
                    window.location.href = this.url + '/' + this.data.id;
                }
            }
        },
        render(h) {
            return h('tr', {
                    class: { active: this.active, 'int-table__block': true },
                    on: { click: this.goTo }
                }, [
                    this.tableOptions.map(option => {
                        return h('td', {class: [option.className]}, this.getCell(this.data, option))
                    }),
                    //Mobile toggle button
                    h('td', {
                        on:{ click: this.setActive},
                        attrs: {class: 'int-table__controll-tab int-table__controll-tab_big'}
                    }, [
                        h('a', {attrs: {class:'int-table__show', href: ''}}, [
                            h('i', {attrs: {class:'icon icon-box-down'}})
                        ])
                    ])
                ]
            )
        }
    }
</script>
