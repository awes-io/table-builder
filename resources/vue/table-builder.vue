<template>
    <div class="int-table">

        <!-- header slot -->
        <slot name="header"></slot>

        <!-- no columns -> show as list -->
        <div :class="listClass"
            v-if="tableData && ! hasColumns"
        >
            <div :class="listRowClass"
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
        <div class="int-table__overflow">
            <table
                v-if="tableData && hasColumns"
                class="int-table__table"
            >
                <thead>
                    <tr>
                        <th v-for="({ label, sort }, i) in columnsHead" :key="i">
                            <tb-sort-button
                                v-if="sort"
                                v-bind="sort"
                            >
                                {{ label }}
                            </tb-sort-button>
                            <template v-else>{{ label }}</template>
                        </th>
                        <th v-if="hiddenOptions && hiddenOptions.length"></th>
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
                            @click="rowClick"
                            ref="tbRows"
                        ></tb-row>
                        <tr class="int-table__hidden"
                            v-if="hiddenColumnData"
                            v-show="activeItem === i"
                            :key="i + '-hidden-row'">
                            <td :colspan="shownOptions.length + 1">
                                <slot
                                    name="hidden"
                                    :data="rowData"
                                    :hiddenData="hiddenColumnData[i]"
                                    :matchedMedia="matchedMedia"
                                    :index="i"
                                >
                                    <tb-hidden-items
                                        :hiddenOptions="hiddenOptions"
                                        :data="rowData"
                                        :index="i"
                                        :active="activeItem === i"
                                        :matchedMedia="matchedMedia"
                                    >
                                    </tb-hidden-items>
                                </slot>
                            </td>
                        </tr>     
                    </template>
                </tbody>
            </table>
        </div>

        <!-- footer slot -->
        <slot name="footer"></slot>
    </div>
</template>

<script>
import { ucFirst, trimStr } from '../js/modules/fp.js'
import mediaQueriesMixin from '../js/mixins/media-queries.js'
import configMixin from '../js/mixins/config.js'
import tbRow from './tb-row.vue'
import tbHiddenItems from './tb-hidden-items.vue'
import tbSortButton from './tb-sort-button.vue'

export default {

    name: 'table-builder',

    mixins: [ mediaQueriesMixin, configMixin ],

    components: { tbRow, tbHiddenItems, tbSortButton },


    props: {

        default: [Array, Object],

        listClass: {
            type: String,
            default: 'int-table__list'
        },

        listRowClass: {
            type: String,
            default: 'int-table__list-row'
        },

        rowUrl: String,

        rowClick: {
            type: Function,
            default(data) {
                if ( data && data.url ) {
                    window.location.href = AWES.utils.urlFromTemplate(data.url, data.data)
                }
            }
        }
    },


    data() {
        return {
            activeItem: null
        }
    },


    computed: {

        tableData() {
            return Array.isArray(this.default) ? this.default : [this.default]
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
            return this.columns && this.columns.map(item => {
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
            })/*.map( item => item.name )*/
        },

        hiddenOptionsNames() {
            return this.hiddenOptions && this.hiddenOptions.map( item => item.name )
        },

        hiddenColumnData() {
            if ( ! this.hiddenOptions || ! this.hiddenOptions.length ) return false
            return this.tableData.map( row => {
                if ( ! row ) return 
                let hiddenData = {}
                Object.keys(row)
                      .filter( key => this.hiddenOptionsNames.includes(key) )
                      .forEach( key => { hiddenData[key] = row[key] })
                return hiddenData
            })
        },

        columnsHead() {
            return this.shownOptions.map( option => {
                let label = ucFirst( typeof option.label !== 'undefined' ? option.label : option.name )
                let sort = typeof option.sort === 'string' ? this._getSortParams( option.name, option.sort ) : false
                return { label, sort }
            })
        }
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

        _getSortParams(label, sort) {

            let asc = this.$get(this._config, 'sort.ascTemplate').replace('%s', label)
            let desc = this.$get(this._config, 'sort.descTemplate').replace('%s', label)

            if ( sort !== '' ) {
                let [_asc, _desc] = sort.split('|').map(trimStr)
                asc = _asc || ''
                desc = _desc || ''
            }
            return { asc, desc }
        }
    }
}
</script>