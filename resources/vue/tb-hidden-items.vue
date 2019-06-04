<script>
function getItem(props, option) {
    return option.scopedSlots ?
        option.scopedSlots({
            data: props.data,
            index: props.index,
            active: props.active,
            matchedMedia: props.matchedMedia
        }) :
        props.data[option.name]
}

function isEmpty(item) {
    return Array.isArray(item) ? item.every(isEmpty) : item.isComment
}

export default {

    name: 'tb-row-hidden',

    functional: true,

    props: {

        data: {
            type: Object,
            required: true
        },

        hiddenOptions: {
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

        matchedMedia: Array,
    },

    render(h, ctx) {

        const { props } = ctx

        const items = props.hiddenOptions
            .map( option => getItem(props, option) )
            .filter( item => ! isEmpty(item) )

        return h('ul', { staticClass: 'int-table__hidden-items' }, items.map( (item, i) => {
                return h('li', { staticClass: 'int-table__hidden-item', key: i }, item)
            })
        )
    }
}
</script>