<script>
    export default {
        name: 'tb-mobile',
        props: {
            mobileOptions: {
                type: Object,
                require: true
            },
            data: {
                type: Object,
                require: true
            },
            countRows: {
                type: Number,
                default: 1
            }
        },
        render(h) {
            return h('tr', {attrs:{class:'int-table__hidden'}}, [
                h('td', {attrs: {colspan:this.countRows+1}}, this.mobileOptions.data.scopedSlots.default(this.data))
            ]);
        }
    }
</script>
