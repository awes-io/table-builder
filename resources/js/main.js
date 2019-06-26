import store from './modules/store.js'
import plugin from './plugin.js'
import lang from './modules/lang.js'
import { name, version } from '../../package.json'

const awesPlugin = {

    name, version,

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
