import { css } from '@emotion/css'
import * as Chart from 'chart.js'
import * as React from 'react'
import { createCustomTooltip } from './tooltip'

const classes = {
    container: css({
        width: '100% !important',
        height: '100% !important',
    }),
}

Chart.defaults.global.defaultFontSize = 14

/*
 * chart.js responsiveness features do not work well with flexbox because the api sets static pixel values on chart's
 * width and height based on parent size.
 * This prevents the flex components from shrinking, and consequently the entire page, caused by the static sizes.
 * '100% !important' must be set on canvas size properties to override the ones set by chart.js, so the page can shrink.
 */

/**
 * Column chart component which minor tweaks to better display time data.
 * This chart supports multi axis by settings different unit strings for each dataset.
 * The hour ('h') unit has special treatment related to its axis range ticks, but all units will work seamlessly.
 * This chart will automatically resize based on the parent size.
 *
 * @param props.labels list of column labels
 * @param props.datasets datasets to be rendered by the graph
 */
export const ColumnChart = (props: {
    labels: string[]
    datasets: { label: string; data: number[]; unit: string; color: string; hidden: boolean }[]
}) => {
    const container$ = React.useRef<HTMLCanvasElement>()
    const chart = React.useRef<Chart>()

    // initialize the chart
    React.useLayoutEffect(() => {
        chart.current = new Chart.Chart(container$.current.getContext('2d'), { type: 'bar' })
        return () => chart.current.destroy()
    }, [])

    // refresh custom chart options based on datasets
    React.useLayoutEffect(() => {
        const datasets = props.datasets
        const shownDatasets = props.datasets.filter(dataset => !dataset.hidden)
        const units = new Set(datasets.map(dataset => dataset.unit))
        const shownUnits = new Set(shownDatasets.map(dataset => dataset.unit))

        // object containing formatter functions for each unit, used to compute chart tick strings
        const unitFormatters = [...units.values()].reduce((acc, next) => {
            acc[next] = value => `${value}${next}`
            return acc
        }, {} as { [unit: string]: (value: number) => string })

        // special formatter for the hour unit
        unitFormatters['h'] = value => `${(value as number).toFixed(0)}${value != 0 ? 'h' : ''}`

        // same as unitFormatters but based on dataset label, used by the render tooltip function
        const labelFormatters = datasets.reduce((acc, next) => {
            acc[next.label] = unitFormatters[next.unit]
            return acc
        }, {} as { [label: string]: (value: number) => string })

        // special axis computation for hour data (unit === 'h')
        const hourUnitDatasets = shownDatasets.filter(dataset => dataset.unit === 'h')
        const hourData = hourUnitDatasets.flatMap(dataset => dataset.data)
        const largestSample = Math.max(...hourData)
        const roundToMax = largestSample > 72 ? 24 : largestSample > 48 ? 12 : largestSample > 24 ? 8 : 6
        const max = largestSample > 24 ? Math.ceil(largestSample / roundToMax) * roundToMax : 24
        const stepSize = max > 72 ? 24 : max > 48 ? 12 : max > 24 ? 8 : 6

        // support for multi axes based on unit type
        const xAxes: Chart.ChartXAxe[] = [{ gridLines: { display: false } }]
        const yAxes: Chart.ChartYAxe[] = [...units.values()].map<Chart.ChartYAxe>(unit => ({
            id: unit,
            display: shownUnits.has(unit),
            gridLines: { borderDash: [3, 1] },
            ticks: {
                beginAtZero: true,
                callback: unitFormatters[unit],
                ...(unit === 'h' && { maxTicksLimit: 7, max, stepSize }),
            },
        }))

        // custom tooltip configuration
        const { renderTooltip, removeTooltip } = createCustomTooltip(undefined, true, false, labelFormatters)

        chart.current.options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: false },
            scales: { xAxes, yAxes },
            tooltips: { enabled: false, custom: renderTooltip },
        }

        return removeTooltip
    })

    // set labels and datasets, and update the chart
    React.useLayoutEffect(() => {
        chart.current.data.labels = props.labels
        chart.current.data.datasets = props.datasets.map(({ label, data, unit, color, hidden }) => ({
            label,
            data,
            yAxisID: unit,
            hidden,
            backgroundColor: color,
            hoverBackgroundColor: color,
            barPercentage: 1,
            categoryPercentage: 0.85,
        }))
        chart.current.update()
    })

    return <canvas className={classes.container} ref={container$} />
}
