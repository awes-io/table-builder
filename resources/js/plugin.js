import tableBuilder from '../vue/table-builder.vue'
import tbRow from '../vue/tb-row.vue'
import tbColumn from '../vue/tb-column.vue'
import paginateBuilder from '../vue/paginate-builder.vue'

export function install(Vue) {

    if ( this.installed ) return
    this.installed = true

    Vue.component('table-builder', tableBuilder)
    Vue.component('tb-row', tbRow)
    Vue.component('tb-column', tbColumn)
    Vue.component('paginate-builder', paginateBuilder)
}

export default {

    installed: false,

    install
}
