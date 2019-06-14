import { shallowMount } from '@vue/test-utils'
import paginateBuilder from './../paginate-builder'

describe('paginate-builder', () => {

    let wrapper;

    let state;

    beforeEach(() => {
        wrapper = shallowMount(paginateBuilder, {
            stubs: {
                'context-menu': true,
                'cm-query': true
            },
            mocks: {
                $route: {
                    path: 'path',
                    hash: '#hash'
                },
                $get: () => {},
                $router: {
                    $setParam: (data) => state = data
                }
            }
        });
    });

    it('displays from, to and total meta data', () => {

        wrapper.setProps({
            meta: {
                from: 1,
                to: 10,
                total: 100
            }
        })

        expect(wrapper.find('span.pager__caption').text())
            .toBe('Record 1-10 of 100')
    })

    it('return 1 as default value from currentPage()', () => {
        expect(wrapper.vm.currentPage).toBe(1)
    })

    it('return page number from currentPage()', () => {

        wrapper = shallowMount(paginateBuilder, {
            stubs: {
                'context-menu': true,
                'cm-query': true
            },
            mocks: {
                $route: {},
                $get: () => 10
            }
        });

        expect(wrapper.vm.currentPage).toBe(10)
    })

    it('returns null from paginate() if meta is empty', () => {
        expect(wrapper.vm.paginate).toBe(null)
    })

    it('returns false from paginate() if there is only 1 page', () => {

        wrapper.setProps({
            meta: {
                last_page: 1
            }
        })

        expect(wrapper.vm.paginate).toBe(false)
    })

    it('returns array from paginate() if there are less or 7 pages', () => {

        wrapper.setProps({
            meta: {
                last_page: 7
            }
        })

        expect(wrapper.vm.paginate).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    it('returns array with skipped values from paginate()', () => {

        wrapper.setProps({
            meta: {
                current_page: 35,
                last_page: 70
            }
        })

        expect(wrapper.vm.paginate).toEqual([1, false, 34, 35, 36, false, 70])
    })

    it('sets params on setPage(page) if page and meta exist', () => {

        wrapper.setProps({
            meta: {
                last_page: 10
            },
        })

        state = 0

        wrapper.vm.setPage(10)

        expect(state).toEqual({ page: "10" })
    })

    it('doesnt set params on setPage(page) if page less than 0', () => {

        wrapper.setProps({
            meta: {
                last_page: 10
            },
        })

        state = 0

        wrapper.vm.setPage(-10)

        expect(state).toEqual(0)
    })

    it('doesnt set params on setPage(page) if meta doesnt exist', () => {

        state = 0

        wrapper.vm.setPage(10)

        expect(state).toEqual(0)
    })

    it('doesnt set params on setPage(page) if page number is greater than last page', () => {

        wrapper.setProps({
            meta: {
                last_page: 10
            },
        })

        state = 0

        wrapper.vm.setPage(11)

        expect(state).toEqual(0)
    })

    it('returns string from getStringified(page)', () => {

        AWES.utils.stringifyQuery = (data) => data.page

        expect(wrapper.vm.getStringified(11)).toEqual('path?11#hash')
    })

    it('renders context-menu to select per page limit', () => {

        wrapper.setProps({
            meta: {}
        })

        expect(wrapper.findAll('context-menu-stub cm-query-stub').length).toEqual(3)

        expect(wrapper.findAll('context-menu-stub cm-query-stub').at(0).text()).toEqual('10')

        expect(wrapper.findAll('context-menu-stub cm-query-stub').at(1).text()).toEqual('50')

        expect(wrapper.findAll('context-menu-stub cm-query-stub').at(2).text()).toEqual('100')
    })

    it('renders pagination controls', () => {

        wrapper.setProps({
            meta: {
                last_page: 10,
                current_page:5
            }
        })

        expect(wrapper.findAll('.btn-group > .btn').length).toEqual(5)

        expect(wrapper.findAll('.btn-group > .btn').at(0).text()).toEqual('1')

        expect(wrapper.findAll('.btn-group > .btn').at(1).text()).toEqual('4')

        expect(wrapper.findAll('.btn-group > .btn').at(2).text()).toEqual('5')

        expect(wrapper.findAll('.btn-group > .btn').at(3).text()).toEqual('6')

        expect(wrapper.findAll('.btn-group > .btn').at(4).text()).toEqual('10')

        expect(wrapper.findAll('.btn-group__separator').length).toEqual(2)

        expect(wrapper.findAll('.btn-group__separator').at(0).text()).toEqual('...')

        expect(wrapper.findAll('.btn-group__separator').at(1).text()).toEqual('...')
    })
}) 