import { css } from '@emotion/css'
import * as React from 'react'
import { SearchBar } from './SearchBar'

const classes = {
    container: `d-flex w-100 ${css({ background: '#f0f0f0' })}`,
}

export const Dashboard = () => (
    <div className={classes.container}>
        <SearchBar />
    </div>
)
