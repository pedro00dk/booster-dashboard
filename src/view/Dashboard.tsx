import { css } from '@emotion/css'
import * as React from 'react'
import { fetchRepositoryData, GraphQlError, RepositoryData } from '../api'
import * as metrics from '../metrics'
import { Card } from './Card'
import { ColumnChart } from './charts/ColumnChart'
import { LineChart } from './charts/LineChart'
import { MenuBar } from './MenuBar'
import { SearchBar } from './SearchBar'
import { Tabs } from './Tabs'
import { TimeDisplay } from './TimeDisplay'

const classes = {
    container: css({
        display: 'flex',
        color: 'black',
        fontFamily: '"Helvetica Regular", sans-serif',
    }),
    cards: css({
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        background: '#f1f2f5',
    }),
    row: css({
        display: 'flex',
        flexWrap: 'wrap',
        padding: '-0.75em',
    }),
    col: css({
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75em',
    }),
}

export const Dashboard = () => {
    const [repositoryData, setRepositoryData] = React.useState<RepositoryData>()
    const [fetching, setFetching] = React.useState(false)
    const abortSearch = React.useRef<() => void>()
    const setColumnsData = React.useRef<(labels: string[], data: number[]) => void>()
    const today = new Date()
    today.setDate(today.getDate() + 1)
    today.setHours(0, 0, 0, -1)
    const oneMonthAgo = new Date(today)
    const twoMonthsAgo = new Date(today)
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

    /**
     * Access the api to fetch repository data.
     * This function is a callback passed to the SearchBar component.
     * If some repository data is already being fetched, the request is aborted and a new request is sent.
     *
     * @param username github username
     * @param repository user repository
     */
    const searchCallback = async (username: string, repository: string) => {
        abortSearch.current?.()
        setFetching(true)
        try {
            const { promise, abort } = fetchRepositoryData(username, repository, twoMonthsAgo)
            abortSearch.current = abort
            const result = await promise
            setRepositoryData(result)
            setFetching(false)
        } catch (error) {
            if (error instanceof DOMException) return // aborted request (no not reset fetching)
            const message = error instanceof GraphQlError ? error.errors[0].message : error.message
            alert(message)
            setRepositoryData(undefined)
            setFetching(false)
        }
    }

    const averagePullRequestMergeTime = metrics.computeAveragePullRequestMergeTime(
        repositoryData?.pullRequests ?? [],
        oneMonthAgo,
        today
    )
    const averageIssueCloseTime = metrics.computeAverageIssueCloseTime(
        repositoryData?.pullRequests ?? [],
        oneMonthAgo,
        today
    )
    const createdPullRequests = metrics.createdInRange(repositoryData?.pullRequests ?? [], oneMonthAgo, today)
    const createdIssues = metrics.createdInRange(repositoryData?.issues ?? [], oneMonthAgo, today)
    const { labels: columnChartLabels, datasets: columnChartDatasets } = metrics.createPullRequestSizeDatasets(
        repositoryData,
        oneMonthAgo,
        today
    )
    const {
        labels: lineChartLabels,
        pullRequestDatasets: lineChartPullRequestDatasets,
        issuesDatasets: lineChartIssuesDatasets,
    } = metrics.createDaySummaryDatasets(repositoryData, oneMonthAgo, today)

    console.log(lineChartPullRequestDatasets)

    return (
        <div className={classes.container}>
            <MenuBar />
            <div className={classes.cards}>
                <SearchBar searchCallback={searchCallback} />
                <div className={classes.col}>
                    <Card title='Average Merge Time by Pull Request Size'>
                        <div style={{ flexGrow: 1, height: '28em', padding: '0em 1.5em' }}>
                            <ColumnChart labels={columnChartLabels} datasets={columnChartDatasets} />
                        </div>
                    </Card>
                    <div className={classes.row}>
                        <Card title='Average Pull Request Merge Time'>
                            <TimeDisplay time={averagePullRequestMergeTime ?? 0} />
                        </Card>
                        <Card title='Average Issue Close Time'>
                            <TimeDisplay time={averageIssueCloseTime ?? 0} />
                        </Card>
                    </div>
                    <Card title='Month Summary'>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                height: '33em',
                                marginTop: '-1em',
                            }}
                        >
                            <Tabs
                                tabs={[
                                    { name: 'Pull Requests', value: createdPullRequests },
                                    { name: 'Issues', value: createdIssues },
                                ]}
                            />
                            <div style={{ height: '25em', padding: '0em 1.5em' }}>
                                <LineChart labels={lineChartLabels} datasets={lineChartPullRequestDatasets} />
                            </div>
                        </div>
                    </Card>
                </div>
                <span style={{ height: '3.15em' }} />
            </div>
        </div>
    )
}
