import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
    container: `d-flex flex-column w-100 p-3 mb-3 shadow-sm ${css({ fontSize: '1.5em', background: 'white' })}`,
    userInput: `border-0 ${css({ marginBottom: '-0.15em', fontSize: '1em', outline: 'none' })}`,
    repositoryInput: `border-0 text-black-50 ${css({ fontSize: '0.6em', outline: 'none' })}`,
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
