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

export const ColumnChart = (props: { data?: { label: string; data: number[] }[] }) => {
    const chart = async (ref: SVGSVGElement) => {
        console.log('chart', ref)
        const data = await d3.csv(
            'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv',
        )
        console.log('data', data)

        var margin = { top: 30, right: 30, bottom: 70, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom

        // append the svg object to the body of the page
        var svg = d3
            .select(ref)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        // X axis
        var x = d3
            .scaleBand()
            .range([0, width])
            .domain(
                data.map(function (d) {
                    return d.Country
                }),
            )
            .padding(0.2)
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end')

        // Add Y axis
        var y = d3.scaleLinear().domain([0, 13000]).range([height, 0])
        svg.append('g').call(d3.axisLeft(y))

        // Bars
        svg.selectAll('mybar')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return x(d.Country)
            })
            .attr('y', function (d) {
                return y(d.Value)
            })
            .attr('width', x.bandwidth())
            .attr('height', function (d) {
                return height - y(d.Value)
            })
            .attr('fill', '#69b3a2')
    }

    return <svg ref={chart} />
}
