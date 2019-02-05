<script>
export default {

    name: 'tb-row',

    props: {

        data: {
            type: Object,
            required: true
        },

        tableOptions: {
            type: Array,
            required: true
        },

        index: {
            type: Number,
            required: true
        },

        active: {
            type: Boolean,
            default: false
        },

        url: {
            type: String,
            default: null
        },

        matchedMedia: Array,

        showToggler: {
            type: Boolean,
            default: false
        }
    },


    methods: {

        getCell(data, option) {
            return option.scopedSlots ?
                    option.scopedSlots({
                        data: data,
                        index: this.index,
                        active: this.active,
                        matchedMedia: this.matchedMedia
                    }) :
                    this.data[option.name]
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
                this.showToggler ? h('td', {
                    on:{ click: this.setActive},
                    attrs: {class: 'int-table__control-tab'}
                }, [
                    h('a', {attrs: {class:'int-table__show', href: ''}}, [
                        h('i', {attrs: {class:'icon icon-box-down'}})
                    ])
                ]) : null
            ]
        )
    }
}
</script>
