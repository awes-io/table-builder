<template>
    <div class="int-table" :class="{'is-loading': isLoading, 'is-empty': ! tableData && ! isLoading}">


        <!-- no data -->
        <div class="int-table__no-data" v-if="! tableData && ! isLoading">
            <slot name="empty">
                {{ $lang.TABLE_NO_DATA }}
            </slot>
        </div>

        <!-- loading state -->
        <div class="int-table__loader" v-if="isLoading">
            <slot name="loader">
                {{ $lang.TABLE_LOADING }}
            </slot>
        </div>


        <!-- no columns -> show as list -->
        <div class="int-table__list"
            v-if="tableData && ! hasColumns"
        >
            <div class="int-table__list-row"
                v-for="(row, i) in tableData"
                :key="i"
            >
                <slot
                    name="list"
                    :tableData="tableData"
                    :data="row"
                    :index="i"
                >
                    <template v-if="typeof row === 'object'">
                        <div class="int-table__list-cell"
                            v-for="(item, key) in row"
                            :key="key"
                        >
                            <span class="int-table__list-name">{{ key }} : </span>
                            <span class="int-table__list-value">{{item}}</span>
                        </div>
                    </template>
                    <template v-else>
                        {{ row }}
                    </template>
                </slot>
            </div>
        </div>


        <!-- table -->
        <table
            v-if="tableData && hasColumns"
            class="int-table__table"
        >
            <thead>
                <tr>
                    <th v-for="(name, i) in columnNames" :key="i">{{ name }}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(rowData, i) in tableData">
                    <tb-row
                        :key="i + '-row'"
                        :tableOptions="shownOptions"
                        :data="rowData"
                        :index="i"
                        :active="activeItem === i"
                        :url="rowUrl"
                        :matchedMedia="matchedMedia"
                        :showToggler="!!hiddenColumnData"
                        @setActive="setActiveItem"
                    ></tb-row>
                    <tr class="int-table__hidden"
                        v-if="hiddenColumnData"
                        v-show="activeItem === i"
                        :key="i + '-hidden-row'">
                        <td :colspan="shownOptions.length + 1">
                            <slot
                                name="hidden"
                                :rowData="rowData"
                                :data="hiddenColumnData[i]"
                                :matchedMedia="matchedMedia"
                                :index="i"
                            >
                                <ul>
                                    <li v-for="(option, j) in hiddenColumnData[i]" :key="j + '-hidden'">
                                        {{ option }}
                                    </li>
                                </ul>
                            </slot>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>

    </div>
</template>

<script>
import { ucFirst } from '../js/modules/fp.js'
import mediaQueries from '../js/mixins/media-queries.js'

export default {

    name: 'table-builder',

    mixins: [ mediaQueries ],


    props: {

        storeData: {
            type: String,
            required: true
        },

        default: [Array, Object],

        rowUrl: String
    },


    data() {
        return {
            activeItem: null
        }
    },


    computed: {

        tableData() {
            let fromStore = AWES._store.state[this.storeData]
            return fromStore && fromStore.length ? fromStore : false
        },

        isLoading() {
            return AWES._store.state[this.storeData + '_loading']
        },

        columns() {
            return this.$slots.default && this.$slots.default.filter( item => {
                return item.componentOptions && item.componentOptions.tag === 'tb-column'
            })
        },

        hasColumns() {
            return this.columns && !! this.columns.length
        },

        tableOptions() {
            return this.columns.map(item => {
                return Object.assign({}, item.componentOptions.propsData, {
                    className: item.data.staticClass,
                    scopedSlots: item.data.scopedSlots && item.data.scopedSlots.default ?
                                 item.data.scopedSlots.default :
                                 null
                });
            });
        },

        shownOptions() {
            return this.tableOptions && this.tableOptions.filter( item => {
                if ( ! item.media || item.media && this._checkMediaMatch(item.media) ) return true
            })
        },

        hiddenOptions() {
            return this.tableOptions && this.tableOptions.filter( item => {
                if ( item.media && ! this._checkMediaMatch(item.media) ) return true
            }).map( item => item.name )
        },

        hiddenColumnData() {
            if ( ! this.hiddenOptions || ! this.hiddenOptions.length || ! this.tableData ) return false
            return this.tableData.map( row => {
                let hiddenData = {}
                Object.keys(row)
                      .filter( key => this.hiddenOptions.includes(key) )
                      .forEach( key => { hiddenData[key] = row[key] })
                return hiddenData
            })
        },

        columnNames() {
            return this.shownOptions.map( item => {
                return ucFirst( typeof item.label !== 'undefined' ?
                                       item.label :
                                       item.name )
            })
        },
    },


    watch: {

        hiddenColumnData( data ) {
            if ( data === false ) this.activeItem = null
        }
    },


    methods: {

        setActiveItem(index, val) {
            if (val) {
                this.activeItem = index;
            } else {
                this.activeItem = null
            }
        },
    },


    beforeCreate() {

        let dafault = this.$options.propsData.default
        if ( ! dafault ) return;

        let defaultData = Array.isArray(dafault) ?
                          dafault.slice() :
                          [ Object.assign({}, this.$options.propsData.default) ]
        AWES._store.commit('setData', {
            param: this.$options.propsData.storeData,
            data: defaultData
        })
    }
}
</script>