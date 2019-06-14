import { mount } from '@vue/test-utils'
import tbHiddenItems from './../tb-hidden-items'

describe('tb-hidden-items', () => {

    it('renders single ul', () => {

        let wrapper = mount(tbHiddenItems, {
            propsData: {
                data: {},
                hiddenOptions: [],
                index: 0
            }
        })

        expect(wrapper.findAll('ul').length).toEqual(1)
    })

    it('renders basic ul\'s class', () => {

        let wrapper = mount(tbHiddenItems, {
            propsData: {
                data: {},
                hiddenOptions: [],
                index: 0
            }
        })

        expect(wrapper.find('ul').classes()).toEqual(['int-table__hidden-items'])
    })

    it('renders multiple li\'s', () => {

        let wrapper = mount(tbHiddenItems, {
            propsData: {
                data: {
                    one: {},
                    two: {}
                },
                hiddenOptions: [
                    { name: 'one' },
                    { name: 'two' }
                ],
                index: 0
            }
        })

        expect(wrapper.findAll('li').length).toEqual(2)
    })

    it('renders basic li\'s class', () => {

        let wrapper = mount(tbHiddenItems, {
            propsData: {
                data: {
                    one: {},
                    two: {}
                },
                hiddenOptions: [
                    { name: 'one' },
                    { name: 'two' }
                ],
                index: 0
            }
        })

        expect(wrapper.findAll('li').at(0).classes()).toEqual(['int-table__hidden-item'])

        expect(wrapper.findAll('li').at(1).classes()).toEqual(['int-table__hidden-item'])
    })

    it('skips comment nodes (cells, hidden with v-show)', () => {

        let wrapper = mount(tbHiddenItems, {
            propsData: {
                data: {
                    one: { isComment: true },
                    two: {}
                },
                hiddenOptions: [
                    { name: 'one' },
                    { name: 'two' }
                ],
                index: 0
            }
        })

        expect(wrapper.findAll('li').length).toEqual(1)
    })

    it('matches overall snapshot', () => {

        let wrapper = mount(tbHiddenItems, {
            propsData: {
                data: {
                    one: { isComment: true },
                    two: {}
                },
                hiddenOptions: [
                    { name: 'one' },
                    { name: 'two' }
                ],
                index: 0,
                active: true
            }
        })

        expect(wrapper.html()).toMatchSnapshot();
    })
})