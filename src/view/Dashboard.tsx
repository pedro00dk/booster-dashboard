import { css } from '@emotion/css'
import * as React from 'react'
import { fetchRepositoryData, GraphQlError } from '../api'
import { Card } from './Card'
import { ColumnChart } from './charts/ColumnChart'
import { SearchBar } from './SearchBar'
import { TimeDisplay } from './TimeDisplay'

const classes = {
    container: `d-flex flex-column w-100 ${css({
        background: '#f1f2f5',
        color: 'black',
    })}`,
    row: `d-flex flex-wrap ${css({
        padding: '-0.75em',
    })}`,
    col: `d-flex flex-column ${css({
        padding: '0.75em',
    })}`,
}

type RepositoryDataPromise = ReturnType<typeof fetchRepositoryData>['promise']
type RepositoryData = RepositoryDataPromise extends PromiseLike<infer T> ? T : RepositoryDataPromise

export const Dashboard = () => {
    const [repositoryData, setRepositoryData] = React.useState<RepositoryData>()
    const [fetching, setFetching] = React.useState(false)
    const abortSearch = React.useRef<() => void>()
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
     * If some repository data is already being fetched, it is aborted and a new request is send.
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
        } catch (error) {
            if (error instanceof DOMException) return // aborted request
            const message = error instanceof GraphQlError ? error.errors[0].message : error.message
            alert(message)
        } finally {
            setFetching(false)
        }
    }

    const computeAveragePullRequestMergeTime = () => {
        if (fetching || repositoryData == undefined) return 0
        const mergeTimes = repositoryData.pullRequests
            .filter(pullRequest => pullRequest.mergedAt != undefined && pullRequest.mergedAt >= oneMonthAgo)
            .map(pullRequest => pullRequest.mergedAt.getTime() - pullRequest.createdAt.getTime())
        return mergeTimes.reduce((acc, next) => acc + next, 0) / mergeTimes.length
    }

    const computeAverageIssueCloseTime = () => {
        if (fetching || repositoryData == undefined) return 0
        const closeTimes = repositoryData.issues
            .filter(issue => issue.closedAt != undefined && issue.closedAt >= oneMonthAgo)
            .map(pullRequest => pullRequest.closedAt.getTime() - pullRequest.createdAt.getTime())
        return closeTimes.reduce((acc, next) => acc + next, 0) / closeTimes.length
    }

    const averagePullRequestMergeTime = computeAveragePullRequestMergeTime()
    const averageIssueCloseTime = computeAverageIssueCloseTime()

    console.log(repositoryData, fetching)

    return (
        <div className={classes.container}>
            <SearchBar searchCallback={searchCallback} />
            <div className={classes.col}>
                <Card label='Average Merge Time by Pull Request Size'>
                    <div className='px-4' style={{ width: '100%', height: '28em' }}>
                        <ColumnChart setDataCallback={setData => setData(['Small', 'Medium', 'Large'], [20, 32, 45])} />
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
