import store from './modules/store.js'
import plugin from './plugin.js'
import lang from './modules/lang.js'
import { name, version } from '../../package.json'

const awesPlugin = {

    name, version,

    modules: {
        'vue-smoothscroll': {
            src: 'https://unpkg.com/vue-smoothscroll@0.2.0/dist/vue-smoothscroll.js',
            deps: ['vue'],
            cb() {
                Vue.use(VueSmoothScroll)
            }
        },
        'lodash': {
            src: 'https://unpkg.com/lodash@4.17.11/lodash.min.js',
            deps: ['vue']
        }
    },

    install() {
        Vue.use(plugin)
        AWES.lang = lang
    }
}

if (window && ('AWES' in window)) {
    AWES.use(awesPlugin)
} else {
    window.__awes_plugins_stack__ = window.__awes_plugins_stack__ || []
    window.__awes_plugins_stack__.push(awesPlugin)
}
