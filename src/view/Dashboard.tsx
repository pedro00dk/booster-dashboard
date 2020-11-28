import { css } from '@emotion/css'
import * as React from 'react'
import { fetchRepositoryData, GraphQlError, RepositoryData } from '../api'
import { computeRepositoryMetrics } from '../metrics'
import { Card } from './Card'
import { ColumnChart } from './charts/ColumnChart'
import { MenuBar } from './MenuBar'
import { SearchBar } from './SearchBar'
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

    const {
        hasData,
        smallPullRequests,
        mediumPullRequests,
        largePullRequests,
        averagePullRequestMergeTime = 0,
        averageSmallPullRequestMergeTime = 0,
        averageMediumPullRequestMergeTime = 0,
        averageLargePullRequestMergeTime = 0,
        averageIssueCloseTime = 0,
        monthPullRequests,
        monthIssues,
    } = computeRepositoryMetrics(repositoryData, oneMonthAgo, today)

    const labels = ['Small', 'Medium', 'Large']
    const datasets = !hasData
        ? [{ label: '', data: [0, 0, 0], unit: 'h', color: 'transparent', hidden: false }]
        : [
              {
                  label: 'Average Time',
                  data: [
                      averageSmallPullRequestMergeTime / (1000 * 60 * 60),
                      averageMediumPullRequestMergeTime / (1000 * 60 * 60),
                      averageLargePullRequestMergeTime / (1000 * 60 * 60),
                  ],
                  unit: 'h',
                  color: 'rgba(76, 155, 255)',
                  hidden: false,
              },
              {
                  label: 'Pull Requests',
                  data: [smallPullRequests.length, mediumPullRequests.length, largePullRequests.length],
                  unit: '',
                  color: '',
                  hidden: true,
              },
          ]

    console.log('here', repositoryData, fetching)

    return (
        <div className={classes.container}>
            <MenuBar />
            <div className={classes.cards}>
                <SearchBar searchCallback={searchCallback} />
                <div className={classes.col}>
                    <Card title='Average Merge Time by Pull Request Size'>
                        <ColumnChart
                            style={{ height: '28em', padding: '0em 1.5em' }}
                            labels={labels}
                            datasets={datasets}
                        />
                    </Card>
                    <div className={classes.row}>
                        <Card title='Average Pull Request Merge Time'>
                            <TimeDisplay time={averagePullRequestMergeTime} />
                        </Card>
                        <Card title='Average Issue Close Time'>
                            <TimeDisplay time={averageIssueCloseTime} />
                        </Card>
                    </div>
                    <Card title='Month Summary'>
                        <div style={{ width: '100%', height: '32em' }} />
                    </Card>
                </div>
                <span style={{ height: '3.15em' }} />
            </div>
        </div>
    )
}
