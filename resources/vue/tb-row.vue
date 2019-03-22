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

        url: String,

        matchedMedia: Array,

        showToggler: {
            type: Boolean,
            default: false
        }
    },


    computed: {

        urlFormatted() {
            return this.url && AWES.utils.urlFromTemplate(this.url, this.data)
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

        /**
         * Checks for click on interactive lement: <a> or <button>
         * to prevent redirect
         * 
         * @param  {HTMLElement}  eventTarget - clicked target
         * @return {Boolean} if this was a click on interactive element
         */
        isInteraction(eventTarget) {
            let interaction = false
            const elements = ['a', 'button']
            const match = el => elements.includes(el.tagName.toLowerCase())
            while ( ! interaction && eventTarget !== this.$el ) {
                if ( match(eventTarget) ) interaction = true
                eventTarget = eventTarget.parentElement
            }
            return interaction
        },

        goTo(event) {
            if ( this.isInteraction(event.target) ) return
            window.location.href = this.urlFormatted
        }
    },


    render(h) {
        return h('tr', {
                class: { active: this.active, 'int-table__block': true, 'is-link': this.url },
                on: this.url ? { click: this.goTo } : undefined
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
