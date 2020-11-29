import { css, keyframes } from '@emotion/css'
import * as React from 'react'
import { fetchRepositoryData, GraphQlError, RepositoryData } from '../api'
import * as metrics from '../metrics'
import { Card } from './Card'
import { ColumnChart } from './charts/ColumnChart'
import { MenuBar } from './MenuBar'
import { MonthSummary } from './MonthSummary'
import { SearchBar } from './SearchBar'
import { TimeDisplay } from './TimeDisplay'

const spinnerAnimation = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`

const classes = {
    container: css({
        display: 'flex',
        color: 'black',
        fontFamily: '"Helvetica Regular", sans-serif',
    }),
    header: css({
        display: 'flex',
        alignItems: 'center',
        padding: '1.1em 1.5em 1.25em 1.5em',
        background: 'white',
        boxShadow: '0.07em 0.07em 0.12em 0 rgba(39,40,51,0.08)',
    }),
    spinner: css({
        border: '0.5em solid transparent',
        borderTop: '0.5em solid rgb(76, 155, 255)',
        borderRadius: '50%',
        width: '1.5em',
        height: '1.5em',
        animation: `${spinnerAnimation} 0.75s linear infinite`,
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

/**
 * Root component.
 * The Dashboard waits for user inputs from the search bar, fetches repository data using api.ts utilities, and then
 * compute and memoize chart and display data using metrics.ts utilities.
 */
export const Dashboard = () => {
    const [fetching, setFetching] = React.useState(false)
    const repositoryData = React.useRef<RepositoryData>()
    const error = React.useRef<Error>()
    const abortSearch = React.useRef<() => void>()

    // compute time ranges
    const today = new Date()
    today.setDate(today.getDate() + 1)
    today.setHours(0, 0, 0, -1)
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(today.getMonth() - 1)
    oneMonthAgo.setHours(0, 0, 0, 0)
    const twoMonthsAgo = new Date(today)
    twoMonthsAgo.setMonth(today.getMonth() - 1)
    twoMonthsAgo.setHours(0, 0, 0, 0)

    // memoize display and chart data computation to prevent recomputing when react redraws
    const { pullRequestMergeTime, issueCloseTime, createdPullRequests, createdIssues } = React.useMemo(() => {
        if (fetching || repositoryData.current == undefined) return {}
        const { pullRequests, issues } = repositoryData.current
        return {
            pullRequestMergeTime: metrics.computeAveragePullRequestMergeTime(pullRequests, oneMonthAgo, today),
            issueCloseTime: metrics.computeAverageIssueCloseTime(issues, oneMonthAgo, today),
            createdPullRequests: metrics.createdInRange(pullRequests, oneMonthAgo, today),
            createdIssues: metrics.createdInRange(issues, oneMonthAgo, today),
        }
    }, [fetching, repositoryData.current])
    const { labels: columnChartLabels, datasets: columnChartDatasets } = React.useMemo(() => {
        return metrics.createPullRequestSizeDatasets(repositoryData.current, oneMonthAgo, today)
    }, [fetching, repositoryData.current])
    const { labels: lineChartLabels, pullRequestDatasets, issuesDatasets } = React.useMemo(() => {
        return metrics.createDaySummaryDatasets(repositoryData.current, oneMonthAgo, today)
    }, [fetching, repositoryData.current])

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
        repositoryData.current = undefined
        error.current = undefined
        setFetching(true)
        try {
            const { promise, abort } = fetchRepositoryData(username, repository, twoMonthsAgo)
            abortSearch.current = abort
            repositoryData.current = await promise
            setFetching(false)
        } catch (e) {
            error.current = e
            if (e instanceof DOMException) return // aborted request (no not reset fetching)
            const message = e instanceof GraphQlError ? e.errors[0].message : e.message
            alert(message)
            setFetching(false)
        }
    }

    // console.log(fetching, error.current, repositoryData.current)

    return (
        <div className={classes.container}>
            <MenuBar />
            <div className={classes.cards}>
                <div className={classes.header}>
                    <SearchBar searchCallback={searchCallback} />
                    {fetching && <div className={classes.spinner}></div>}
                </div>
                <div className={classes.col}>
                    <Card title='Average Merge Time by Pull Request Size'>
                        <div style={{ flexGrow: 1, height: '28em', padding: '0em 1.5em' }}>
                            <ColumnChart labels={columnChartLabels} datasets={columnChartDatasets} />
                        </div>
                    </Card>
                    <div className={classes.row}>
                        <Card title='Average Pull Request Merge Time'>
                            <TimeDisplay time={pullRequestMergeTime} />
                        </Card>
                        <Card title='Average Issue Close Time'>
                            <TimeDisplay time={issueCloseTime} />
                        </Card>
                    </div>
                    <Card title='Month Summary'>
                        <MonthSummary
                            labels={lineChartLabels}
                            tabs={[
                                { name: 'Pull Requests', value: createdPullRequests, datasets: pullRequestDatasets },
                                { name: 'Issues', value: createdIssues, datasets: issuesDatasets },
                            ]}
                        />
                    </Card>
                </div>
                <span style={{ height: '3.15em' }} />
            </div>
        </div>
    )
}
