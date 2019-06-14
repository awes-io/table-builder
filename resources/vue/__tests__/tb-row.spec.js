import { mount } from '@vue/test-utils'
import tbRow from './../tb-row'

describe('tb-row', () => {

    it('renders single tr', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [],
                index: 1
            }
        })

        expect(wrapper.findAll('tr').length).toEqual(1)
    })

    it('renders basic tr\'s class', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [],
                index: 1
            }
        })

        expect(wrapper.find('tr').classes()).toEqual(['int-table__block'])
    })

    it('renders multiple td\'s', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [{}, {}],
                index: 1
            }
        })

        expect(wrapper.findAll('td').length).toEqual(2)
    })

    it('renders specified td\'s class name', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [
                    { className:'some-class' }
                ],
                index: 1
            }
        })

        expect(wrapper.find('td').classes()).toEqual(['some-class'])
    })

    it('renders multiple specified td\'s class names', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [
                    { className:'some-class-1' },
                    { className:'some-class-2' }
                ],
                index: 1
            }
        })

        expect(wrapper.findAll('td').at(0).classes()).toEqual(['some-class-1'])

        expect(wrapper.findAll('td').at(1).classes()).toEqual(['some-class-2'])
    })

    it('adds active class if corresponding prop is true', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [],
                index: 1,
                active: true
            }
        })

        expect(wrapper.find('tr').classes()).toContain('active')
    })

    it('adds is-link class if url is available', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [],
                index: 1,
                url: 'url'
            }
        })

        expect(wrapper.find('tr').classes()).toContain('is-link')
    })

    it('displays toggler', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [],
                index: 1,
                showToggler: true
            }
        })

        expect(wrapper.find('td').classes()).toEqual(['int-table__control-tab'])

        expect(wrapper.find('a').classes()).toEqual(['int-table__show'])

        expect(wrapper.find('i').classes()).toEqual(['icon', 'icon-box-down'])
    })

    it('matches overall snapshot', () => {

        let wrapper = mount(tbRow, {
            propsData: {
                data: {},
                tableOptions: [
                    { className:'some-class-1' },
                    { className:'some-class-2' }
                ],
                index: 1,
                active: true,
                url: 'url',
                showToggler: true
            }
        })

        expect(wrapper.html()).toMatchSnapshot();
    })

    it('emits click event on row click', () => {

        const clickHandler = jest.fn()
        const setActiveHandler = jest.fn()

        let wrapper = mount(tbRow, {
            listeners: {
                click: clickHandler,
                setActive: setActiveHandler
            },
            propsData: {
                data: {},
                tableOptions: [
                    { className:'some-class-1' },
                    { className:'some-class-2' }
                ],
                index: 1,
                active: false,
                url: 'url',
                showToggler: true
            }
        })

        wrapper.find('tr').trigger('click')

        expect(clickHandler).toHaveBeenCalledTimes(1)
        expect(setActiveHandler).not.toHaveBeenCalled()
    })

    it('emits setActive event on trigger click', () => {

        const clickHandler = jest.fn()
        const setActiveHandler = jest.fn()

        let wrapper = mount(tbRow, {
            listeners: {
                click: clickHandler,
                setActive: setActiveHandler
            },
            propsData: {
                data: {},
                tableOptions: [
                    { className:'some-class-1' },
                    { className:'some-class-2' }
                ],
                index: 1,
                active: false,
                url: 'url',
                showToggler: true
            }
        })

        wrapper.find('a.int-table__show').trigger('click')

        expect(setActiveHandler).toHaveBeenCalledTimes(1)
        expect(clickHandler).not.toHaveBeenCalled()
    })
}) 