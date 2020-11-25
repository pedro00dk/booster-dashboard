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
 */
export const SearchBar = () => {
    return (
        <div className={classes.container}>
            <input className={classes.userInput} placeholder='Username or Organization' onChange={() => {}} />
            <input className={classes.repositoryInput} placeholder='Repository' onChange={() => {}} />
        </div>
    )
}
