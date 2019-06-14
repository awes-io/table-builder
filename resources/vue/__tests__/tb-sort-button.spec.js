import { shallowMount } from '@vue/test-utils'
import tbSortButton from './../tb-sort-button'

describe('tb-sort-button', () => {

    let wrapper;

    let state = null;

    beforeEach(() => {

        state = null

        wrapper = shallowMount(tbSortButton, {
            propsData: {
                asc: 'asc',
                desc: 'desc'
            },
            slots: {
                default: '<div class="slot-content"></div>'
            },
            mocks: {
                $route: {
                    path: 'path',
                    query: {}
                },
                $get: () => {},
                $router: {
                    $setParam: (data) => state = data
                }
            }
        });
    });

    it('renders slot inside of the button', () => {

        const button = wrapper.find('button')

        expect(button.findAll('div.slot-content').length).toEqual(1)
    })

    it('renders only static class when order doesn\'t match', () => {

        expect(wrapper.find('button').classes()).toEqual(['tb-sort-button'])
    })

    it('renders ascending and active classes when order matches', () => {

        wrapper.vm.$route.query = { orderBy: 'asc' }

        expect(wrapper.find('button').classes()).toContain('is-active')

        expect(wrapper.find('button').classes()).toContain('is-asc')
    })

    it('renders descending and active classes when order matches', () => {

        wrapper.vm.$route.query = { orderBy: 'desc' }

        expect(wrapper.find('button').classes()).toContain('is-active')

        expect(wrapper.find('button').classes()).toContain('is-desc')
    })

    it('iterates through asc, desc and empty value on button click', () => {

        const button = wrapper.find('button')

        expect(state).toBeNull()

        button.trigger('click')

        expect(state).toEqual({ orderBy: 'asc' })

        wrapper.vm.$route.query = { orderBy: 'asc' } // mock router behaviour
        button.trigger('click')

        expect(state).toEqual({ orderBy: 'desc' })

        wrapper.vm.$route.query = { orderBy: 'desc' } // mock router behaviour
        button.trigger('click')

        expect(state).toEqual({ orderBy: null })
    })

     it('iterates through one passed order prop and empty value on button click, when other order prop is empty', () => {

        wrapper.setProps({ desc: '' })

        const button = wrapper.find('button')

        expect(state).toBeNull()
        expect(wrapper.find('button').classes()).toContain('is-desc')

        button.trigger('click')

        expect(state).toEqual({ orderBy: 'asc' })

        wrapper.vm.$route.query = { orderBy: 'asc' } // mock router behaviour
        button.trigger('click')

        expect(state).toEqual({ orderBy: '' })
    })

    it('matches overall snapshot', () => {

        expect(wrapper.html()).toMatchSnapshot();
    })
})