import * as Chart from 'chart.js'
import * as React from 'react'

const classes = {
    container: 'd-flex w-100 h-100',
}

Chart.defaults.global.defaultFontSize = 14

/**
 * Dynamically compute chart options.
 * The options that may change are related to maximum vertical axis value and tick step resolution.
 *
 * @param data chart data
 */
const computeChartOptions = (data: number[]): Chart.ChartOptions => {
    const largestSample = Math.max(...data)
    const roundToMax = largestSample > 72 ? 24 : largestSample > 48 ? 12 : largestSample > 24 ? 8 : 6
    const max = largestSample > 24 ? Math.ceil(largestSample / roundToMax) * roundToMax : 24
    const stepSize = max > 72 ? 24 : max > 48 ? 12 : max > 24 ? 8 : 6
    const callback: Chart.NestedTickOptions['callback'] = value => `${value}${value != 0 ? 'h' : ''}`
    return {
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [
                {
                    gridLines: { borderDash: [3, 1] },
                    ticks: { beginAtZero: true, maxTicksLimit: 7, max, stepSize, callback },
                },
            ],
        },
    }
}

/**
 * Create a chart.js dataset, which contains chart data and some rendering properties.
 *
 * @param data chart data
 */
const createDataset = (data: number[]) => ({
    data,
    backgroundColor: 'rgba(76, 155, 255)',
    hoverBackgroundColor: 'rgba(76, 155, 255)',
    barPercentage: 1,
    categoryPercentage: 0.85,
})

/**
 * Simple column chart component which minor tweaks to better display time data.
 *
 * @param props.setDataCallback callback that accepts a function to update the chart labels and values
 */
export const ColumnChart = (props: {
    setDataCallback?: (setData: (labels: string[], data: number[]) => void) => void
}) => {
    const canvas$ = React.useRef<HTMLCanvasElement>()
    const chart = React.useRef<Chart>()

    React.useLayoutEffect(() => {
        chart.current = new Chart.Chart(canvas$.current.getContext('2d'), { type: 'bar' })
        props.setDataCallback?.(setData)
    }, [])

    const setData = (labels: string[], data: number[]) => {
        chart.current.data.labels = labels
        chart.current.data.datasets = [createDataset(data)]
        chart.current.options = computeChartOptions(data)
        chart.current.update()
    }

    return (
        <div className={classes.container}>
            <canvas ref={canvas$} />
        </div>
    )
}
