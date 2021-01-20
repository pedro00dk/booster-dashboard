import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
    container: css({
        display: 'flex',
        flexDirection: 'column',
        width: '5em',
        background: '#30313f',
    }),
    icon: css({
        width: '2em',
        height: '2em',
        margin: '1.85em 1.5em',
    }),
}

/**
 * Vertical menu bar, there is not a lot to say about it.
 */
export const MenuBar = () => <div className={classes.container} />
