<template>
    <div class="pager" v-if="meta">
        <span class="pager__caption">Record {{ meta.from }}-{{ meta.to }} of {{ meta.total }}</span>

        <div class="pager__middle" v-if="paginate">
            <div class="pager__links">
                <a
                    :href="getStringified(currentPage - 1)"
                    class="pager__arr-left awes-spa-ignore"
                    @click.stop.prevent="setPage(currentPage - 1)"
                >
                    <i class="icon icon-arrow-left"></i>
                </a>
                <div class="btn-group">
                    <template v-for="(p, i) in paginate">
                        <a  v-if="p"
                            :key="i"
                            class="btn has-wave awes-spa-ignore"
                            :href="getStringified(p)"
                            :class="{'active': p === currentPage}"
                            @click.stop.prevent="setPage(p)"
                        >
                            {{ p }}
                            <span class="wave"></span>
                        </a>
                        <span v-else class="btn-group__separator" :key="i">...</span>
                    </template>
                </div>
                <a
                    :href="getStringified(currentPage + 1)"
                    class="pager__arr-right awes-spa-ignore"
                    @click.stop.prevent="setPage(currentPage + 1)"
                >
                    <i class="icon icon-arrow-right"></i>
                </a>
            </div>
        </div>

        <div class="pager__shows">
            <context-menu top>
                <template slot="toggler">
                    <span class="pager__shows-link">{{ meta.per_page }}</span>
                </template>
                <cm-query :param="{limit: '', page: ''}">10</cm-query>
                <cm-query :param="{limit: '50', page: ''}">50</cm-query>
                <cm-query :param="{limit: '100', page: ''}">100</cm-query>
            </context-menu>
        </div>
    </div>
</template>

<script>
import { compare } from '../js/modules/fp.js'
import config from '../js/modules/config.js'

export default {

    name: 'paginate-builder',

    props: {

        meta: Object,

        scrollTo: {
            type: [String, Boolean],
            default() {
                return this._config.scrollTo
            }
        }
    },


    data() {
        return {
            serverData: {}
        }
    },


    computed: {

        currentPage() {
            return parseInt( this.$get(this.$route.query, 'page') ) || 1
        },

        paginate() {
            if ( ! this.meta ) return null;
            let offset = 2;
            //Если выводится одна страница, то нумерацию не показываем
            if (this.meta.last_page < 2) {
                return false;
            }
            //Усли не более 7 страниц, используем простую пагинацию
            if (this.meta.last_page <= 7) {
                return Array(this.meta.last_page).fill().map((_, idx) => idx + 1);
            }
            //Исходные данные
            let pagesArray = [1];
            let from = this.meta.current_page - offset;
            let to = this.meta.current_page + offset;

            //Нумерация
            if (from <= 1) {
                from = 2;
                to = offset*3;
            }
            else if ( to >= this.meta.last_page ) {
                to = this.meta.last_page - 1;
                from = this.meta.last_page - offset*3 + 1;
            }

            //Набираем массив
            for (let i = from; i <= to; i++) {
                //Проверяем показывать цифру или же диапазон пропускаемых значений
                if ( (i === from || i === to) && (i !== 2 && i !== (this.meta.last_page - 1))) {
                    pagesArray.push(false);
                } else {
                    pagesArray.push(i);
                }

            }

            //Добавим последнюю страницу
            pagesArray.push(this.meta.last_page);
            //Отдаем массив
            return pagesArray;
        },

        scrollElement() {
            return this.scrollTo && this._isMounted && document.querySelector(this.scrollTo)
        }
    },


    methods: {

        setPage(page) {
            if (page > 0 && this.meta && page <= this.meta.last_page) {
                this.$router.$setParam({ page: page.toString() })
            }
        },

        getStringified(page) {
            return this.$route.path + '?' + AWES.utils.stringifyQuery(Object.assign({}, this.$route.query, {page})) + this.$route.hash
        }
    },


    beforeCreate() {
        // config
        this._config = Object.assign(config, _.pick(AWES._config.tableBuilder, Object.keys(config)))
    },


    created() {
        //Если данные не переданы в компонент, забираем с севера
        if ( this.default === false) {
            this.updateData(this.$route)
        } else {
            this.serverData = this.default;
        }
    }
}
</script>
