import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
    container: `d-flex flex-column w-100 shadow-sm bg-white ${css({
        padding: '0.75em 1.5em 1.25em 1.5em',
    })}`,
    userInput: `p-0 border-0 ${css({
        fontSize: '1.5em',
        color: '#2e2838',
        marginBottom: '-0.15em',
        outline: 'none',
        '::placeholder': { color: 'black' },
    })}`,
    repositoryInput: `p-0 border-0 ${css({
        fontSize: '0.85em',
        color: '#ab9ebd',
        outline: 'none',
    })}`,
}

/**
 * Search github usernames, organizations and repositories.
 * When the user presses enter or remove the focus of the inputs, onTriggerSearch is called.
 *
 * @param props.searchCallback callback function thar accepts the username and repository
 *
 */
export const SearchBar = (props: { searchCallback?: (username: string, repository: string) => void }) => {
    const username = React.useRef('')
    const repository = React.useRef('')

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => (username.current = event.target.value)
    const onRepositoryChange = (event: React.ChangeEvent<HTMLInputElement>) => (repository.current = event.target.value)

    /**
     * Trigger searchCallback when the user presses enter on the input.
     */
    const onKeyup = (event: React.KeyboardEvent) => {
        if (event.key !== 'Enter') return
        const element = event.target as HTMLInputElement
        event.preventDefault()
        event.stopPropagation()
        element.blur()
        if (username.current.length == 0 || repository.current.length == 0) return
        props.searchCallback?.(username.current, repository.current)
    }

    return (
        <div className={classes.container}>
            <input
                className={classes.userInput}
                placeholder='Username or Organization'
                onChange={onUsernameChange}
                onKeyUp={onKeyup}
            />
            <input
                className={classes.repositoryInput}
                placeholder='Repository'
                onChange={onRepositoryChange}
                onKeyUp={onKeyup}
            />
        </div>
    )
}
