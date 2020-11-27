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
    label: css({
        padding: '1.1em 1.65em',
        fontSize: '0.9em',
        color: '#272833',
    }),
    separator: css({
        margin: 0,
    }),
    content: css({
        display: 'flex',
        padding: '1em',
    }),
}

/**
 * Card container used to wrap and label charts and other components.
 *
 * @param props.label card header label
 * @param props.children card content
 */
export const Card = (props: { label: string; children?: React.ReactNode | React.ReactNode[] }) => (
    <div className={classes.container}>
        <span className={classes.label}>{props.label}</span>
        <hr className={classes.separator} />
        <div className={classes.content}>{props.children}</div>
    </div>
)
