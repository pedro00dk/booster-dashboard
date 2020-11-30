import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactTestUtils from 'react-dom/test-utils'
import { SearchBar } from '../src/view/SearchBar'

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
    ReactDom.render(<SearchBar />, container)
    ReactDom.unmountComponentAtNode(container)
})

it('triggers search callback', () => {
    const mockedSearchCallback = jest.fn((username: string, repository: string) => {})
    ReactTestUtils.act(() => {
        ReactDom.render(<SearchBar searchCallback={mockedSearchCallback} />, container)
    })
    const usernameInput$ = document.getElementsByTagName('input')[0]
    const repositoryInput$ = document.getElementsByTagName('input')[1]
    usernameInput$.value = 'username'
    repositoryInput$.value = 'repository'
    ReactTestUtils.Simulate.change(usernameInput$)
    ReactTestUtils.Simulate.change(repositoryInput$)
    ReactTestUtils.Simulate.keyUp(usernameInput$, { key: 'Enter', keyCode: 13, which: 13 })
    expect(mockedSearchCallback).toBeCalledWith('username', 'repository')
    usernameInput$.value = 'another-username'
    repositoryInput$.value = 'another-repository'
    ReactTestUtils.Simulate.change(usernameInput$)
    ReactTestUtils.Simulate.change(repositoryInput$)
    ReactTestUtils.Simulate.keyUp(repositoryInput$, { key: 'Enter', keyCode: 13, which: 13 })
    expect(mockedSearchCallback).toBeCalledWith('another-username', 'another-repository')
    expect(mockedSearchCallback).toBeCalledTimes(2)
})
