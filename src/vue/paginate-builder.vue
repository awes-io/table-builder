<template>
    <div class="pager" v-if="meta !== null">
        <span class="pager__caption">Record {{ meta.from }}-{{ meta.to }} of {{ meta.total }}</span>
        <div class="pager__middle" v-if="paginate">
            <div class="pager__links">
                <a class="pager__arr-left" href="" @click.prevent="setPage(meta.current_page-1)"><i class="icon icon-arrow-left"></i></a>
                <div class="pager__links-wrap">
                    <span v-for="p in paginate">
                        <a v-if="p" class="pager__link" href="" @click.prevent="setPage(p)" :class="{ 'pager__link_active': p === meta.current_page }">{{ p }}</a>
                        <span v-else class="pager__spacer">...</span>
                    </span>
                </div>
                <a class="pager__arr-right" href="" @click.prevent="setPage(meta.current_page+1)"><i class="icon icon-arrow-right"></i></a>
            </div>
        </div>
        <div class="pager__shows">

            <context-menu top>
                <template slot="toggler">
                    <span class="pager__shows-link">{{ meta.per_page }}</span>
                </template>
                <cm-query :param="{limit: ''}">10</cm-query>
                <cm-query :param="{limit: 50}">50</cm-query>
                <cm-query :param="{limit: 100}">100</cm-query>
            </context-menu>

        </div>
    </div>
</template>

<script>
    import { compare } from '../js/modules/fp.js'

    export default {
        name: 'paginate-builder',
        props: {
            data: {
                type: [Object, Array, Boolean],
                default: false
            },
            url: {
                type: String,
                require: true
            },
            'storeData': {
                type: String,
                require: true
            }
        },
        data() {
            return {
                serverData: {}
            }
        },
        created() {
            //Если данные не переданы в компонент, забираем с севера
            if ( this.data === false) {
                this.updateData();
            } else {
                this.serverData = this.data;
            }
        },
        computed: {
            meta: function () {
                let meta = _.get(this.serverData, 'meta.pagination');
                if ( meta === undefined ) return null;
                return {
                    current_page: meta.current_page,
                    from: meta.from,
                    last_page: meta.last_page,
                    per_page: meta.per_page,
                    to: meta.to,
                    total: meta.total
                }
            },
            paginate: function() {
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
            }
        },
        watch: {
            // в случае изменения маршрута запрашиваем данные вновь
            '$route': 'updateData',
            serverData: function () {
                this.$tableBuilder.commit('setData', {
                    param: this.storeData,
                    data: this.serverData.data
                });
            }
        },
        methods: {
            updateData(newParam, oldParam) {
                if ( oldParam && _.isEqual(oldParam.query, newParam.query) ) return
                let params = this.$route.query;
                if ( oldParam && !compare(oldParam.query, newParam.query, ['page']) && params['page'] != 1) {
                    this.setPage(1);
                } else {
                    this.fetchData(params);
                }
            },
            fetchData(params) {
                AWES.on('core:ajax', this.setLoader)
                AWES.ajax(params, this.url, 'get')
                    .then( res => {
                        this.serverData = res.data
                    })
                    .catch( e => {
                        console.log(e);
                    })
                    .finally(() => {
                        AWES.off('core:ajax', this.setLoader)
                    })
            },
            setLoader($event) {
                this.$tableBuilder.commit('setData', {
                    param: this.storeData + '_state',
                    data: $event.detail
                });
            },
            update() {
                this.updateData();
            },
            setPage(page) {
                if (page > 0 && page <= this.meta.last_page) {
                    this.$router.push({
                        query: Object.assign({}, this.$route.query, { page: page.toString() })
                    });
                }
            }
        },
        beforeCreate() {
            this._routerRoot = this
            this._router = AWES._vueRouter
            this._router.init(this)
            Vue.util.defineReactive(this, '_route', this._router.history.current)
        }
    }
</script>
