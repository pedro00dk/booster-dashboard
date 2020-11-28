import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
    container: css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        margin: '0.75em',
        borderRadius: '0.25em',
        background: 'white',
        boxShadow: '0.07em 0.07em 0.12em 0 rgba(39,40,51,0.08)',
    }),
    title: css({
        padding: '1.25em 1.65em',
        fontSize: '0.9em',
        color: '#272833',
    }),
    separator: css({
        margin: 0,
        border: 0,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    }),
    content: css({
        display: 'flex',
        padding: '1em',
    }),
}

/**
 * Card container used to wrap other components.
 *
 * @param props.title card title
 * @param props.children card content
 */
export const Card = (props: { title: string; children?: React.ReactNode | React.ReactNode[] }) => (
    <div className={classes.container}>
        <span className={classes.title}>{props.title}</span>
        <hr className={classes.separator} />
        <div className={classes.content}>{props.children}</div>
    </div>
)
