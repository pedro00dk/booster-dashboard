import * as Chart from 'chart.js'
import * as React from 'react'
const classes = {
    container: 'd-flex w-100 h-100',
}

Chart.defaults.global.defaultFontSize = 14
console.log((Chart.defaults.global.defaultColor = ''))

const chartOptions: Chart.ChartOptions = {
    legend: { display: false },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        xAxes: [{ gridLines: { display: false } }],
        yAxes: [
            {
                ticks: {
                    beginAtZero: true, //
                    callback: (value, index, values) => `${value}${value != 0 ? 'h' : ''}`,
                },
            },
        ],
    },
}

export const ColumnChart = (props: { onSetData?: (setData: (labels: string[], data: number[]) => void) => void }) => {
    const canvas$ = React.useRef<HTMLCanvasElement>()
    const chart = React.useRef<Chart>()

    React.useLayoutEffect(() => {
        chart.current = new Chart.Chart(canvas$.current.getContext('2d'), { type: 'bar', options: chartOptions })
        props.onSetData?.(setData)
        setData(['Small', 'Medium', 'Large'], [20, 32, 45])
    }, [])

    const setData = (labels: string[], data: number[], color = '#5d83ff') => {
        chart.current.data.labels = labels
        chart.current.data.datasets = [{ data, backgroundColor: color, hoverBackgroundColor: color }]
        chart.current.update()
    }

    return (
        <div className={classes.container}>
            <canvas ref={canvas$} />
        </div>
    )
}
