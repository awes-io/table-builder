<template>
    <button
        class="tb-sort-button"
        :class="{'is-active': isActive, 'is-asc': isAsc, 'is-desc': isDesc }"
        @click="sort"
    >
        <slot></slot>
        <svg width="16" height="16" viewBox="0 0 20 20">
            <path v-show="isAsc" d="M17 13H3l7-8z"/>
            <path v-show="isDesc" d="M3 7h14l-7 8z"/>
            <path v-show="! isActive" d="M17 9H3l7-8z M3 11h14l-7 8z"/>
        </svg>
    </button>
</template>


<script>
import configMixin from '../js/mixins/config.js'

export default {

    name: 'tb-sort-button',

    mixins: [ configMixin ],

    props: {

        asc: {
            type: String,
            required: true
        },

        desc: {
            type: String,
            required: true
        }
    },


    computed: {

        currentOrder() {
            return this.$route.query.orderBy
        },

        orderParams() {
            return [this.asc, this.desc, null]
        },

        isAsc() {
            return this.currentOrder === this.asc
        },

        isDesc() {
            return this.currentOrder === this.desc
        },

        isActive() {
            return this.isAsc || this.isDesc
        }
    },


    methods: {

        sort() {
            let sort = {}
            sort[this._config.sort.param] = this._getNext()
            this.$router.$setParam(sort, false)
        },

        _getNext() {
            let nextIndex = this.orderParams.indexOf(this.currentOrder) + 1
            nextIndex = nextIndex >= this.orderParams.length ? 0 : nextIndex
            return this.orderParams[nextIndex]
        }
    }
}
</script>