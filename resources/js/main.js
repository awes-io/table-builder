import store from './modules/store.js'
import plugin from './plugin.js'

const awesPlugin = {

    modules: {
        'vue': {
            src: 'https://unpkg.com/vue@2.5.21/dist/vue.js',
            cb() {
                Vue.use(plugin)
            }
        },
        'vue-router': {
            src: 'https://unpkg.com/vue-router@3.0.2/dist/vue-router.min.js',
            deps: ['vue'],
            cb() {
                AWES._vueRouter = AWES._vueRouter || new VueRouter({ mode: 'history' })
            }
        },
        'vue-smoothscroll': {
            src: 'https://unpkg.com/vue-smoothscroll@0.2.0/dist/vue-smoothscroll.js',
            deps: ['vue'],
            cb() {
                Vue.use(VueSmoothScroll)
            }
        },
        'lodash': {
            src: 'https://unpkg.com/lodash@4.17.11/lodash.min.js',
            deps: ['vue'],
            cb() {
                Vue.prototype.$get = _.get
            }
        },
        'vuex': {
            src: 'https://unpkg.com/vuex@2.5.0/dist/vuex.min.js',
            deps: ['vue'],
            cb() {
                Vue.prototype.$tableBuilder = new Vuex.Store(store)
            }
        },
        'awes-context-menu': {
            src: 'https://storage.awes.io/680a7d07f89b94e7fc83be657a2daa27/awes-io/context-menu/v0.x.x/js/main.js',
        }
    },

    install() {
        // AWES.lang = i18n
    }
}

if (window && ('AWES' in window)) {
    AWES.use(awesPlugin)
} else {
    window.__awes_plugins_stack__ = window.__awes_plugins_stack__ || []
    window.__awes_plugins_stack__.push(awesPlugin)
}
