import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactTestUtils from 'react-dom/test-utils'
import { classes, Tabs } from '../src/view/Tabs'

let container: HTMLDivElement

beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    container.remove()
    container = undefined
})

it('renders and unmount without crashing', () => {
    ReactDom.render(<Tabs tabs={[]} />, container)
    ReactDom.unmountComponentAtNode(container)
})

it('render no tabs', () => {
    ReactTestUtils.act(() => {
        ReactDom.render(<Tabs tabs={[]} />, container)
    })
    const tabsContainer$ = container.firstChild as HTMLDivElement
    expect(tabsContainer$.hasChildNodes()).toBe(false)
})

it('register tab click', () => {
    const mockedOnClick = jest.fn((name: string) => {})
    ReactTestUtils.act(() => {
        ReactDom.render(
            <Tabs
                tabs={[
                    { name: 'Tab 1', value: 1 },
                    { name: 'Tab 2', value: 2 },
                ]}
                onClick={mockedOnClick}
            />,
            container
        )
    })
    const tabsContainer$ = container.firstChild as HTMLDivElement
    const firstTab$ = tabsContainer$.children[0]
    const secondTab$ = tabsContainer$.children[1]
    ReactTestUtils.Simulate.click(firstTab$)
    expect(mockedOnClick).toBeCalledWith('Tab 1')
    ReactTestUtils.Simulate.click(secondTab$)
    expect(mockedOnClick).toBeCalledWith('Tab 2')
})

it('updates selected tab', () => {
    ReactTestUtils.act(() => {
        ReactDom.render(
            <Tabs
                tabs={[
                    { name: 'Tab 1', value: 1 },
                    { name: 'Tab 2', value: 2 },
                ]}
                selected='Tab 2'
            />,
            container
        )
    })
    const tabsContainer$ = container.firstChild as HTMLDivElement
    const firstTab$ = tabsContainer$.children[0]
    const secondTab$ = tabsContainer$.children[1]
    expect(firstTab$.className).not.toContain(classes.selectedTab)
    expect(secondTab$.className).toContain(classes.selectedTab)
})
