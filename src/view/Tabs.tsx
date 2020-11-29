import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
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
 * Component to display tabs with numeric values.
 * This component does not change tabs, only renders them.
 * The onSelected callback can bed used to know with tab has been clicked.
 *
 * @param props.tabs tabs names and values to display
 * @param props.onSelected callback that reports selected tab name
 */
export const Tabs = (props: { tabs: { name: string; value: number }[]; onSelected?: (name: string) => void }) => {
    const [selected, setSelected] = React.useState(props.tabs[0]?.name)
    if (selected != undefined) props.onSelected?.(selected)

    return (
        <div className={classes.container}>
            {props.tabs?.map(({ name, value }) => (
                <div
                    key={name}
                    className={`${classes.tab} ${name === selected ? classes.selectedTab : classes.unselectedTab}`}
                    onClick={() => setSelected(name)}
                >
                    <span className={classes.name}>{name}</span>
                    <span className={classes.value}>{value}</span>
                </div>
            ))}
        </div>
    )
}
