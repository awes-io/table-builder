import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import tableBuilder from './../table-builder'
import tbRow from './../tb-row'
import tbColumn from './../tb-column'
import { get } from 'lodash'

describe('table-builder as a list', () => {

    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(tableBuilder, {
            propsData: {
                default: [
                    { col1: 'row 1 column 1', col2: 'row 1 column 2' },
                    { col1: 'row 2 column 1', col2: 'row 2 column 2' },
                    { col1: 'row 3 column 1', col2: 'row 3 column 2' }
                ]
            },
            stubs: ['tb-row', 'tb-hidden-items'],
            slots: {
                header: '<div class="test-header-slot" />',
                footer: '<div class="test-footer-slot" />'
            },
            scopedSlots: {
                list: `<div class="test-list-slot">
                    <span>{{props.index}}</span>
                    <p>{{ props.data.col1 }}, {{ props.data.col2 }}</p>
                </div>`
            }
        })
    })


    it('renders table as list when no tb-column passed to slot', () => {

        expect(wrapper.findAll('div.int-table__list').length).toEqual(1)
    })


    it('applies list-class to list wrapper', () => {

        wrapper.setProps({
            listClass: 'test-list-class'
        })

        expect(wrapper.findAll('div.test-list-class').length).toEqual(1)
    })


    it('applies list-row-class to every row', () => {

        wrapper.setProps({
            listRowClass: 'test-row-class'
        })

        expect(wrapper.findAll('div.test-row-class').length).toEqual(3)
    })


    it('renders header slot', () => {

        expect(wrapper.findAll('div.test-header-slot').length).toEqual(1)
    })


    it('renders footer slot', () => {

        expect(wrapper.findAll('div.test-footer-slot').length).toEqual(1)
    })


    it('renders list slot', () => {

        expect(wrapper.findAll('div.test-list-slot').length).toEqual(3)
    })


    it('matches overall snapshot', () => {

        expect(wrapper.html()).toMatchSnapshot()
    })
})


describe('table-builder as a table', () => {

    let wrapper;

    const localVue = createLocalVue()

    localVue.prototype.$get = get
    localVue.component('tb-column', tbColumn)

    beforeEach(() => {
        wrapper = mount(tableBuilder, {
            localVue,
            propsData: {
                default: [
                    { col: 'row 1' },
                    { col: 'row 2' },
                    { col: 'row 3' }
                ]
            },
            stubs: {
                'tb-row': tbRow,
                'tb-hidden-items': true
            },
            slots: {
                default: '<tb-column name="col"/>'
            }
        })
    })


    it('renders table when tb-column passed to slot', () => {

        expect(wrapper.findAll('table.int-table__table').length).toEqual(1)
    })


    it('creates proper sorting names', () => {

        let sortNames

        sortNames = wrapper.vm._getSortParams('test', '')

        expect(sortNames).toEqual({ asc: 'test', desc: 'test_desc' })

        sortNames = wrapper.vm._getSortParams('test', '|some_name')

        expect(sortNames).toEqual({ asc: '', desc: 'some_name' })

        sortNames = wrapper.vm._getSortParams('test', 'my_asc|my_desc')

        expect(sortNames).toEqual({ asc: 'my_asc', desc: 'my_desc' })
    })


    it('sets active index', () => {

        wrapper.vm.setActiveItem(27, true)

        expect(wrapper.vm.activeItem).toEqual(27)

        wrapper.vm.setActiveItem(27, false)

        expect(wrapper.vm.activeItem).toBeNull()
    })


    it('matches overall snapshot', () => {

        expect(wrapper.html()).toMatchSnapshot()
    })
})