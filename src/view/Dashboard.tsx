import { css } from '@emotion/css'
import * as React from 'react'
import { fetchRepositoryData, GraphQlError, RepositoryData } from '../api'
import { computeRepositoryMetrics } from '../metrics'
import { Card } from './Card'
import { ColumnChart } from './charts/ColumnChart'
import { SearchBar } from './SearchBar'
import { TimeDisplay } from './TimeDisplay'

const classes = {
    container: `d-flex flex-column w-100 ${css({
        background: '#f1f2f5',
        color: 'black',
        fontFamily: '"Helvetica Regular", sans-serif',
    })}`,
    row: `d-flex flex-wrap ${css({
        padding: '-0.75em',
    })}`,
    col: `d-flex flex-column ${css({
        padding: '0.75em',
    })}`,
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

    if (!fetching && hasData) {
        setColumnsData.current?.(
            ['Small', 'Medium', 'Large'],
            [
                averageSmallPullRequestMergeTime / (1000 * 60 * 60),
                averageMediumPullRequestMergeTime / (1000 * 60 * 60),
                averageLargePullRequestMergeTime / (1000 * 60 * 60),
            ]
        )
    }

    console.log('here', repositoryData, fetching)

    return (
        <div className={classes.container}>
            <SearchBar searchCallback={searchCallback} />
            <div className={classes.col}>
                <Card label='Average Merge Time by Pull Request Size'>
                    <div className='px-4' style={{ width: '100%', height: '28em' }}>
                        <ColumnChart setDataCallback={setData => (setColumnsData.current = setData)} />
                    </div>
                </Card>
                <div className={classes.row}>
                    <Card label='Average Pull Request Merge Time'>
                        <TimeDisplay time={averagePullRequestMergeTime} />
                    </Card>
                    <Card label='Average Issue Close Time'>
                        <TimeDisplay time={averageIssueCloseTime} />
                    </Card>
                </div>
                <Card label='Month Summary'>
                    <div style={{ width: '100%', height: '32em' }} />
                </Card>
            </div>
            <span style={{ height: '3.15em' }} />
        </div>
    )
}
