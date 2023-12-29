import { UTCDate } from '@date-fns/utc'
import { useSearchParams } from '@solidjs/router'
import * as d3 from 'd3'
import { endOfDay, startOfDay, subMonths } from 'date-fns'
import { Accessor, createComputed, createMemo, createRenderEffect, createSignal } from 'solid-js'
import { Card } from '../components/Card'
import { D3Svg } from '../components/D3Svg'
import { SearchBar } from '../components/SearchBar'
import { Tabs } from '../components/Tabs'
import {
    Issue,
    averageCloseTimeMillis,
    averageMergeTimeMillis,
    dailySummaryDatasets,
    issuesActions,
} from '../stores/issues'
import classes from './Dashboard.module.scss'

export const Dashboard = () => {
    const [search, setSearch] = useSearchParams<Partial<{ tab: string }>>()
    const tab = () => (search.tab ?? 'prs') as 'prs' | 'issues'
    const today = endOfDay(new UTCDate())
    const oneMonthAgo = startOfDay(subMonths(new UTCDate(), 1))
    const [allIssues, setIssues] = createSignal<Issue[]>()
    const prs = createMemo(() => allIssues()?.filter(({ pull_request }) => pull_request))
    const issues = createMemo(() => allIssues()?.filter(({ pull_request }) => !pull_request))
    const averageMergeTime = createMemo(() => prs() && averageMergeTimeMillis(prs()!, oneMonthAgo, today))
    const averageCloseTime = createMemo(() => issues() && averageCloseTimeMillis(issues()!, oneMonthAgo, today))
    const dailySummaryPrs = createMemo(() => {
        const summary = prs() && dailySummaryDatasets(prs()!, oneMonthAgo, today)
        return summary
    })
    const dailySummaryIssues = createMemo(() => {
        const summary = issues() && dailySummaryDatasets(issues()!, oneMonthAgo, today)
        return summary
    })
    const dailySummary = () => (tab() === 'prs' ? dailySummaryPrs() : dailySummaryIssues())

    const onSubmit = async (owner: string, repo: string) => setIssues(await issuesActions.fetchIssues(owner, repo))

    return (
        <article class={classes.root}>
            <Card>
                <SearchBar onSubmit={onSubmit} />
            </Card>
            <div class={classes.cols}>
                <Card title='Average PR merge time'>
                    <span class={classes.duration}>{millisToDuration(averageMergeTime())}</span>
                </Card>
                <Card title='Average issue close time'>
                    <span class={classes.duration}>{millisToDuration(averageCloseTime())}</span>
                </Card>
            </div>
            <Card title='Month summary'>
                <Tabs class={classes.tabs} tab={tab()} onTab={tab => setSearch({ tab })}>
                    <span data-tab='prs'>PRs</span>
                    <span data-tab='issues'>Issues</span>
                </Tabs>
                <D3Svg class={classes.chart} draw={(...args) => dailySummaryChart(...args, dailySummary)} />
            </Card>
        </article>
    )
}

const millisToDuration = (millis?: number) => {
    if (millis == undefined) return `\u{200b}`
    if (isNaN(millis)) return 'Not a Number'
    if (!isFinite(millis)) return millis.toString()
    const minutes = Math.abs(millis) / 60000
    const hours = minutes / 60
    const days = hours / 24
    const dayString = days >= 1 ? `${~~days}d` : ''
    const timeString = `${~~hours % 24}h ${~~minutes % 60}m`
    return `${dayString} ${timeString} ${millis < 0 ? 'remaining' : ''}`
}

const dailySummaryChart = (
    div: HTMLDivElement,
    svg: SVGSVGElement,
    size: Accessor<ResizeObserverSize>,
    data: Accessor<ReturnType<typeof dailySummaryDatasets> | undefined>,
) => {
    const chart = d3.select(svg).append('g')
    const legend = d3.select(div).append('footer')
    const scale = { x: d3.scaleUtc(), y: d3.scaleLinear() }
    const axis = { x: chart.append('g'), y: chart.append('g') }
    const lines = chart.append('g')

    // size changes
    createComputed(() => {
        const { inlineSize, blockSize } = size()
        const pad = { l: 20, r: 15, t: 15, b: 20 }
        const box = { w: inlineSize - pad.l - pad.r, h: blockSize - pad.t - pad.b }
        chart.attr('transform', `translate(${pad.l},${pad.t})`)
        scale.x.range([0, box.w])
        scale.y.range([box.h, 0])
    })

    // data changes
    createComputed(() => {
        if (!data()) return
        const { days, groups } = data()!
        const xd = d3.extent(days) as [Date, Date]
        const yd = [0, Object.values(groups).reduce((acc, next) => Math.max(acc, ...next), 1)]
        scale.x.domain(xd)
        scale.y.domain(yd)
    })

    // render axis
    createRenderEffect(() => {
        size()
        data()
        const w = scale.x.range()[1]
        const h = scale.y.range()[0]
        const ticks = { x: data() ? w / 80 : 0, y: data() ? Math.min(h / 40, scale.y.domain()[1]) : 0 }
        axis.x.attr('transform', `translate(0,${h})`).call(d3.axisBottom(scale.x).ticks(ticks.x).tickSizeInner(-h))
        axis.y.call(d3.axisLeft(scale.y).ticks(ticks.y).tickSizeInner(-w))
    })

    // render lines
    createRenderEffect(() => {
        size()
        if (!data()) return
        const { days, groups, colors } = data()!
        lines
            .selectAll('path')
            .data(Object.entries(groups))
            .join('path')
            .classed(classes.line, true)
            .attr('stroke', ([group]) => colors[group])
            .attr('d', ([, series]) => d3.line((_, i) => scale.x(days[i]), scale.y)(series))
    })

    // render footer
    createRenderEffect(() => {
        if (!data()) return
        const { groups, colors } = data()!
        legend
            .selectAll('span')
            .data(Object.keys(groups))
            .join('span')
            .style('--color', group => colors[group])
            .text(group => group)
    })
}
