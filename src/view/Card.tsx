import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
    container: `d-flex flex-column flex-fill rounded-lg bg-white shadow-sm margin ${css({
        margin: '0.75em',
    })}`,
    label: css({
        fontSize: '0.9em',
        color: '#2e2838',
        padding: '1.1em 1.8em',
    }),
    separator: 'm-0',
    content: 'd-flex p-3',
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
