import { css } from '@emotion/css'
import * as React from 'react'
import menuIcon from '../../public/icon.png'

const classes = {
    container: `d-flex flex-column ${css({
        background: '#30313f',
        width: '5.35em',
    })}`,
    icon: css({
        width: '2em',
        height: '2em',
        margin: '1.87em 1.5em',
    }),
}

/**
 * Vertical menu bar, there is not a lot to say about it.
 */
export const MenuBar = () => (
    <div className={classes.container}>
        <img className={classes.icon} src={menuIcon} alt='icon' />
    </div>
)
