import { css } from '@emotion/css'
import * as Chart from 'chart.js'

const classes = {
    container: css({
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0.25em',
        background: 'white',
        fontSize: '0.9em',
        color: '#272833',
        boxShadow: '0 0.125em 0.5em 0 rgba(39,40,51,0.16)',
        transition: 'opacity 0.1s ease-in-out',
        pointerEvents: 'none',
        ':after': {
            position: 'absolute',
            bottom: '-0.6em',
            left: '50%',
            border: '0.3em solid transparent',
            borderTop: '0.3em solid white',
            content: '""',
        },
    }),
    title: css({
        padding: '0.7em 1em 0.55em 1em',
        color: '#272833',
    }),
    separator: css({
        margin: 0,
    }),
    content: css({
        display: 'flex',
        flexDirection: 'column',
        padding: '0.7em 1em',
    }),
    line: css({
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        margin: '0.3em',
    }),
    dot: css({
        height: '0.62em',
        width: '0.62em',
        marginRight: '0.8em',
        borderRadius: '50%',
    }),
    label: css({
        flexGrow: 1,
        marginRight: '1.6em',
    }),
}

/**
 * Create custom functions to render chart tooltips and to remove it when the tooltip is not in use.
 *
 * @param title tooltip title, if undefined the title is not displayed
 * @param listHiddenDatasets list hidden dataset values in hte tooltip
 * @param shotColorDots show dots with the dataset color
 * @returns two functions for create and remove a tooltip element
 */
export const createCustomTooltip = (title: string = undefined, listHiddenDatasets = false, showColorDots = false) => {
    const id = `chart-tooltip-${Math.random()}`
    /**
     * Render a custom tooltip.
     * The tooltip is similar to a Card component.
     * It is not possible to use react here because this code is triggered by the chart.js library.
     * This function cannot be an arrow function because the chart.js api binds the chart instance to the function, and
     * the chart instance is necessary to compute tooltip positioning.
     *
     * @param tooltipModel tooltip properties provided by chart.js
     */
    function renderCustomTooltip(tooltipModel: Chart.ChartTooltipModel) {
        const tooltip$ = (document.getElementById(id) as HTMLDivElement) ?? document.createElement('div')
        if (tooltip$.id === '') {
            tooltip$.id = id
            tooltip$.className = classes.container
            tooltip$.innerHTML = `
            <span class="${classes.title}" style="${title == undefined ? 'display: none' : ''}">${title ?? ''}</span>
            <hr class="${classes.separator}" style="${title == undefined ? 'display: none' : ''}"></hr>
            <div class="${classes.content}"></div>
            `
            document.body.append(tooltip$)
        }
        tooltip$.style.opacity = tooltipModel.opacity.toString()
        if (tooltipModel.opacity === 0) return
        const content$ = tooltip$.lastElementChild
        content$.innerHTML = ''
        const valueIndex = tooltipModel.dataPoints[0].index
        ;(this._data.datasets as Chart.ChartDataSets[])
            .map(dataset => ({
                label: dataset.label,
                value: dataset.data[valueIndex],
                color: dataset.backgroundColor,
                hidden: dataset.hidden ?? false,
            }))
            .forEach(({ label, value, color, hidden }) => {
                if (label == undefined || value == undefined || (hidden && !listHiddenDatasets)) return
                const line$ = document.createElement('div')
                line$.className = classes.line
                const dot$ = document.createElement('span')
                const label$ = document.createElement('span')
                const value$ = document.createElement('span')
                dot$.className = classes.dot
                label$.className = classes.label
                dot$.style.background = color.toString()
                label$.textContent = label
                value$.textContent = value.toString()
                if (showColorDots) line$.append(dot$)
                line$.append(label$, value$)
                content$.append(line$)
            })
        const tooltipRect = tooltip$.getBoundingClientRect()
        const canvasRect = this._chart.canvas.getBoundingClientRect()
        const left = canvasRect.left + window.pageXOffset + tooltipModel.caretX - tooltipRect.width / 2
        const top = canvasRect.top + window.pageYOffset + tooltipModel.caretY - tooltipRect.height
        tooltip$.style.left = `${left}px`
        tooltip$.style.top = `calc(${top}px - 1em)`
    }

    /**
     * Remove the tooltip from the dom.
     */
    const removeCustomTooltip = () => document.getElementById(id)?.remove()

    return { renderCustomTooltip, destroyCustomTooltip: removeCustomTooltip }
}
