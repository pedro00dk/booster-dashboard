import { SearchBar } from '../components/SearchBar'

export const Dashboard = () => {
    // const [fetching, setFetching] = React.useState(false)
    // const repositoryData = React.useRef<Issue[]>()
    // const error = React.useRef<Error>()
    // const abortSearch = React.useRef<() => void>()

    // // compute time ranges
    // const today = new Date()
    // today.setDate(today.getDate() + 1)
    // today.setHours(0, 0, 0, -1)
    // const oneMonthAgo = new Date(today)
    // oneMonthAgo.setMonth(today.getMonth() - 1)
    // oneMonthAgo.setHours(0, 0, 0, 0)
    // const twoMonthsAgo = new Date(today)
    // twoMonthsAgo.setMonth(today.getMonth() - 1)
    // twoMonthsAgo.setHours(0, 0, 0, 0)

    // // memoize display and chart data computation to prevent recomputing when react redraws
    // const { pullRequestMergeTime, issueCloseTime, createdPullRequests, createdIssues } = React.useMemo(() => {
    //     if (fetching || repositoryData.current == undefined) return {}
    //     const pullRequests = repositoryData.current.filter(({ pull_request }) => pull_request)
    //     const issues = repositoryData.current.filter(({ pull_request }) => !pull_request)
    //     return {
    //         pullRequestMergeTime: metrics.computeAveragePullRequestMergeTime(pullRequests, oneMonthAgo, today),
    //         issueCloseTime: metrics.computeAverageIssueCloseTime(issues, oneMonthAgo, today),
    //         createdPullRequests: metrics.createdInRange(pullRequests, oneMonthAgo, today),
    //         createdIssues: metrics.createdInRange(issues, oneMonthAgo, today),
    //     }
    // }, [fetching, repositoryData.current])
    // // const { labels: columnChartLabels, datasets: columnChartDatasets } = React.useMemo(() => {
    // //     return metrics.createPullRequestSizeDatasets(repositoryData.current, oneMonthAgo, today)
    // // }, [fetching, repositoryData.current])
    // // const { labels: lineChartLabels, pullRequestDatasets, issuesDatasets } = React.useMemo(() => {
    // //     return metrics.createDaySummaryDatasets(repositoryData.current, oneMonthAgo, today)
    // // }, [fetching, repositoryData.current])

    // /**
    //  * Access the api to fetch repository data.
    //  * This function is a callback passed to the SearchBar component.
    //  * If some repository data is already being fetched, the request is aborted and a new request is sent.
    //  *
    //  * @param username github username
    //  * @param repository user repository
    //  */
    // const searchCallback = async (username: string, repository: string) => {
    //     abortSearch.current?.()
    //     repositoryData.current = undefined
    //     error.current = undefined
    //     setFetching(true)
    //     const issues = issuesActions.fetchIssues(username, repository)
    //     repositoryData.current = await issues
    //     setFetching(false)
    // }

    // console.log(fetching, error.current, repositoryData.current)
    const classes = {} as any
    return (
        <div class={classes.container}>
            {/* <MenuBar /> */}
            <div class={classes.cards}>
                <div class={classes.header}>
                    <SearchBar onSubmit={() => console.log('submited')} />
                    {/* {fetching && <div class={classes.spinner} />} */}
                </div>
                {/* <div class={classes.col}>
                    <Card title='Average Merge Time by Pull Request Size'>
                        <div style={{ flexGrow: 1, height: '28em', padding: '0em 1.5em' }}>
                             <ColumnChart labels={columnChartLabels} datasets={columnChartDatasets} /> 
                        </div>
                    </Card>
                    <div class={classes.row}>
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
                </div> */}
                <span style={{ height: '3.15em' }} />
            </div>
        </div>
    )
}
