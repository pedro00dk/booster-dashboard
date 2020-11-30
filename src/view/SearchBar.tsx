import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
    container: css({
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
    }),
    userInput: css({
        padding: 0,
        borderWidth: 0,
        fontSize: '1.5em',
        letterSpacing: 0,
        lineHeight: '1.35em',
        color: '#272833',
        outline: 'none',
        '::placeholder': { color: 'black' },
    }),
    repositoryInput: css({
        padding: 0,
        borderWidth: 0,
        fontSize: '0.85em',
        color: '#a7a9bc',
        outline: 'none',
    }),
}

/**
 * Search bar for github usernames, organizations and repositories.
 * When the user presses enter with one of the inputs focused, searchCallback is called.
 *
 * @param props.searchCallback callback function that accepts a username and repository
 */
export const SearchBar = (props: { searchCallback?: (username: string, repository: string) => void }) => {
    const username = React.useRef('')
    const repository = React.useRef('')

    /**
     * Trigger searchCallback when the user presses enter on the input.
     */
    const onKeyup = (event: React.KeyboardEvent) => {
        if (event.key !== 'Enter') return
        const element = event.target as HTMLInputElement
        element.blur()
        event.preventDefault()
        event.stopPropagation()
        if (username.current.length === 0 || repository.current.length === 0) return
        props.searchCallback?.(username.current, repository.current)
    }

    return (
        <div className={classes.container}>
            <input
                className={classes.userInput}
                placeholder='Username or Organization'
                onChange={event => (username.current = event.target.value)}
                onKeyUp={onKeyup}
            />
            <input
                className={classes.repositoryInput}
                placeholder='Repository'
                onChange={event => (repository.current = event.target.value)}
                onKeyUp={onKeyup}
            />
        </div>
    )
}
