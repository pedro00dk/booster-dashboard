import * as React from 'react'

const classes = {
    container: 'd-flex flex-column rounded-lg bg-white',
    label: 'p-3',
    separator: 'm-0',
    content: 'd-flex p-3',
}

/**
 * Card container used to wrap and label charts and other components.
 */
export const Card = (props: { label: string; children: React.ReactNode }) => (
    <div className={classes.container}>
        <span className={classes.label}>{props.label}</span>
        <hr className={classes.separator} />
        <div className={classes.content}>{props.children}</div>
    </div>
)
