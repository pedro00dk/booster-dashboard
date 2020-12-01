import { css } from '@emotion/css'
import * as React from 'react'
import { LineChart } from './charts/LineChart'
import { Tabs } from './Tabs'

const classes = {
    container: css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        marginTop: '-1em',
    }),
    chart: css({
        height: '22em',
        padding: '1em 1.5em 1.5em 1.5em',
    }),
}

/**
 * Display month summary tabs and charts, and also handle tab interactions.
 *
 * @param props.labels line chart labels
 * @param props.tabs tabs with name and value to be displayed, and the datasets of the chart associated with each tab
 */
export const MonthSummary = (props: { labels: Date[]; tabs: { name: string; value: number; datasets: any }[] }) => {
    const [selected, setSelected] = React.useState(props.tabs[0]?.name)
    const datasets = props.tabs.filter(tab => tab.name === selected)[0]?.datasets ?? []

    return (
        <div className={classes.container}>
            <Tabs tabs={props.tabs} selected={selected} onClick={name => setSelected(name)} />
            <div className={classes.chart}>
                <LineChart tooltipTitle={selected} labels={props.labels} datasets={datasets} />
            </div>
        </div>
    )
}
