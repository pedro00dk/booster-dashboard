/**
 * Column chart component which minor tweaks to better display time data.
 * This chart supports multi axis by settings different unit strings for each dataset.
 * The hour ('h') unit has special treatment related to its axis range ticks, but all units will work seamlessly.
 * This chart will automatically resize based on the parent size.
 *
 * @param props.labels list of column labels
 * @param props.datasets datasets to be rendered by the graph
 */

import * as d3 from 'd3'
import { createRenderEffect, createSignal, onCleanup, onMount } from 'solid-js'

export const LineChart = (props: { data?: { label: string; data: number[] }[] }) => {
    let ref: SVGSVGElement = undefined as any
    const [size, setSize] = createSignal<ResizeObserverSize>({ blockSize: 0, inlineSize: 0 })
    const observer = new ResizeObserver(([{ contentBoxSize }]) => setSize(contentBoxSize[0]))
    onMount(() => observer.observe(ref))
    onCleanup(observer.disconnect)

    createRenderEffect(async () => {
        const width = size().inlineSize
        const height = size().blockSize

        console.log('here', size())

        // append the svg object to the body of the page
        const svg = d3.select(ref)
        svg.selectChildren().remove()
        const g = svg.append('g')
        // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        //Read the data
        const data = await d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv',

            // When reading the csv, I must format variables:
            function (d) {
                return { date: d3.timeParse('%Y-%m-%d')(d.date), value: d.value }
            },
        )

        // Now I can use this dataset:

        // Add X axis --> it is a date format
        var x = d3
            .scaleTime()
            .domain(
                d3.extent(data, function (d) {
                    return d.date
                }),
            )
            .range([0, width])
        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))

        // Add Y axis
        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, function (d) {
                    return +d.value
                }),
            ])
            .range([height, 0])
        g.append('g').call(d3.axisLeft(y))

        // Add the line
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr(
                'd',
                d3
                    .line()
                    .x(function (d) {
                        return x(d.date)
                    })
                    .y(function (d) {
                        return y(d.value)
                    }),
            )
    })

    return <svg ref={ref} width='100%' height='100%' />
}
