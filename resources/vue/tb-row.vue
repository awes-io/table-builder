<script>

function getCell(props, option) {

    return option.scopedSlots ?
            option.scopedSlots({
                data: props.data,
                index: props.index,
                active: props.active,
                matchedMedia: props.matchedMedia
            }) :
            props.data[option.name]
}

function getFormattedUrl(props) {
    return props.url && AWES.utils.urlFromTemplate(props.url, props.data)
}

/**
 * Checks for click on interactive lement: <a> or <button>
 * to prevent redirect
 * 
 * @param  {HTMLElement}  eventTarget - clicked target
 * @return {Boolean} if this was a click on interactive element
 */
function isInteraction(eventTarget) {
    let interaction = false
    const elements = ['A', 'BUTTON']
    const match = el => elements.includes(el.tagName)
    while ( ! interaction && eventTarget.tagName !== 'TR' ) {
        if ( match(eventTarget) ) interaction = true
        eventTarget = eventTarget.parentElement
    }
    return interaction
}

function emitOnClick(event) {
    if ( isInteraction(event.target) ) return
    this.listeners.click.call(window, this.props)
}

function setActive(event) {
    event.preventDefault();
    event.stopPropagation();
    this.listeners.setActive(this.props.index, !this.props.active);
}

export default {

    name: 'tb-row',

    functional: true,

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

    
    render(h, ctx) {

        const props = ctx.props

        const cells = props.tableOptions.map( (option, i) => {
            return h('td', { 
                staticClass: [option.className],
                key: i 
            }, getCell(props, option))
        })

        //Mobile toggle button
        if ( props.showToggler ) {
            cells.push(
                h('td', {
                    key: 'toggler',
                    on:{ click: setActive.bind(ctx) },
                    attrs: {class: 'int-table__control-tab'}
                }, [
                    h('a', {attrs: {class:'int-table__show', href: ''}}, [
                        h('i', {attrs: {class:'icon icon-box-down'}})
                    ])
                ])
            )
        }

        return h('tr', {
            staticClass: 'int-table__block',
            class: { active: props.active, 'is-link': props.url },
            key: props.index + '-row',
            on: props.url ? { click: emitOnClick.bind(ctx) } : undefined }, cells )
    }
}
</script>
