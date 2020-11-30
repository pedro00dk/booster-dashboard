import { css } from '@emotion/css'
import * as React from 'react'

export const classes = {
    container: css({
        display: 'flex',
        height: '8em',
    }),
    tab: css({
        display: 'flex',
        flexDirection: 'column',
        minWidth: '6em',
        padding: '1em',
        borderTop: '3px solid transparent',
        cursor: 'pointer',
        ':hover': {
            background: '#f3f3f3',
            borderTop: '3px solid #0b5fff',
        },
    }),
    selectedTab: css({
        borderTop: '3px solid #0b5fff',
        color: 'black',
    }),
    unselectedTab: css({
        color: '#6b6c7e',
    }),
    name: css({
        fontSize: '1em',
        marginBottom: '0.5em',
    }),
    value: css({
        fontSize: '3em',
    }),
}

/**
 * Display tabs with numeric values.
 * This component does not change tabs, only renders them.
 *
 * @param props.tabs tabs names and values to display
 * @param props.selected the selected tab name
 * @param props.onClick callback triggered when a tab is clicked
 */
export const Tabs = (props: {
    tabs: { name: string; value: number }[]
    selected?: string
    onClick?: (name: string) => void
}) => (
    <div className={classes.container}>
        {props.tabs?.map(({ name, value }) => (
            <div
                key={name}
                className={`${classes.tab} ${name === props.selected ? classes.selectedTab : classes.unselectedTab}`}
                onClick={() => props.onClick?.(name)}
            >
                <span className={classes.name}>{name}</span>
                <span className={classes.value}>{value ?? ''}</span>
            </div>
        ))}
    </div>
)
