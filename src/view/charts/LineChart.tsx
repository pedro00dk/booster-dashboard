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
 * This prevents the flex components and consequently the entire page from shrinking due to the static sizes in canvas.
 * '100% !important' must be set on canvas size properties to override the ones set by chart.js, so the page can shrink.
 */

/**
 * Column chart component which minor tweaks to better display time data.
 * This chart supports multi axis by settings different unit strings for each dataset.
 * The hour ('h') unit has special treatment related to its axis range ticks, but all units will work seamlessly.
 *
 * @param props.style style of the chart container, useful for setting size properties.
 * @param props.labels list of column labels
 * @param props.datasets datasets to be rendered by the graph
 */
export const LineChart = (props: {
    style?: React.CSSProperties
    labels: Date[]
    datasets: { label: string; data: number[]; color: string }[]
}) => {
    const container$ = React.useRef<HTMLCanvasElement>()
    const chart = React.useRef<Chart>()

    // initialize the chart
    React.useLayoutEffect(() => {
        chart.current = new Chart.Chart(container$.current.getContext('2d'), { type: 'line' })
        return () => chart.current.destroy()
    }, [])

    // refresh custom chart options based on datasets
    React.useLayoutEffect(() => {
        const xAxes: Chart.ChartXAxe[] = [
            {
                type: 'time',
                time: { parser: 'MM/DD/YYYY HH:mm', round: 'day' },
                gridLines: { borderDash: [3, 1] },
                ticks: { maxTicksLimit: 5, stepSize: 20, maxRotation: 0 },
            },
        ]
        const yAxes: Chart.ChartYAxe[] = [
            {
                gridLines: { borderDash: [3, 1] },
                ticks: { beginAtZero: true, maxTicksLimit: 5, stepSize: 1 },
            },
        ]

        // custom tooltip configuration
        const { renderTooltip, removeTooltip } = createCustomTooltip('hello tesitng', true, true, undefined)

        chart.current.options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 5,
                    padding: 15,
                    usePointStyle: true,
                },
            },
            scales: { xAxes, yAxes },
            tooltips: { enabled: false, custom: renderTooltip },
        }

        return removeTooltip
    })

    // set labels and datasets, and update the chart
    React.useLayoutEffect(() => {
        chart.current.data.labels = props.labels
        console.log(props.datasets)
        chart.current.data.datasets = props.datasets.map(({ label, data, color }) => ({
            label,
            data,
            borderColor: color,
            fill: false,
            lineTension: 0,
            backgroundColor: color,
            hoverBackgroundColor: color,
        }))
        chart.current.update()
    })

    return <canvas className={classes.container} ref={container$} />
}
