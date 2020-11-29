import { RepositoryData } from './api'

/**
 * Compute the average time taken to a pull request to be merged.
 * If there is no pull requests merged in the time range, undefined is returned.
 *
 * @param pullRequests repository pull requests
 * @param from from date filter
 * @param to to date filter
 * @returns average merge time
 */
export const computeAveragePullRequestMergeTime = (
    pullRequests: RepositoryData['pullRequests'],
    from?: Date,
    to?: Date
) => {
    const mergeTimes = pullRequests
        .filter(
            pullRequest =>
                pullRequest.mergedAt != undefined &&
                (from == undefined || pullRequest.createdAt >= from) &&
                (to == undefined || pullRequest.createdAt <= to)
        )
        .map(pullRequest => pullRequest.mergedAt.getTime() - pullRequest.createdAt.getTime())
    if (mergeTimes.length === 0) return undefined
    return mergeTimes.reduce((acc, next) => acc + next, 0) / mergeTimes.length
}

/**
 * Compute the average time taken to an issue to be closed.
 * If there is no issues closed in the time range, undefined is returned.
 *
 * @param issues repository issues
 * @param from from date filter
 * @param to to date filter
 * @returns average close time
 */
export const computeAverageIssueCloseTime = (issues: RepositoryData['issues'], from?: Date, to?: Date) => {
    const closeTimes = issues
        .filter(
            issue =>
                issue.closedAt != undefined &&
                (from == undefined || issue.createdAt >= from) &&
                (to == undefined || issue.createdAt <= to)
        )
        .map(issue => issue.closedAt.getTime() - issue.createdAt.getTime())
    if (closeTimes.length === 0) return undefined
    return closeTimes.reduce((acc, next) => acc + next, 0) / closeTimes.length
}

/**
 * Count the number of pull requests or issues created in the time range
 * @param prsOrIssues pull requests or issues
 * @param from from date filter
 * @param to to date filter
 */
export const createdInRange = (prsOrIssues: RepositoryData['pullRequests' | 'issues'], from?: Date, to?: Date) => {
    return (prsOrIssues as { createdAt: Date }[]).reduce(
        (acc, next) =>
            acc + Number((from == undefined || next.createdAt >= from) && (to == undefined || next.createdAt <= to)),
        0
    )
}

/**
 * Generate datasets for the column chart of the dashboard.
 *
 * @param repositoryData pull requests and issues
 * @param from from date filter
 * @param to to date filter
 */
export const createPullRequestSizeDatasets = (repositoryData: RepositoryData, from?: Date, to?: Date) => {
    const labels = ['Small', 'Medium', 'Large']
    const datasets = [
        { label: 'Average Time', data: [0, 0, 0], unit: 'h', color: 'rgba(76, 155, 255)', hidden: false },
        { label: 'Pull Requests', data: [0, 0, 0], unit: '', color: 'transparent', hidden: true },
    ]
    if (repositoryData != undefined) {
        const pullRequestsInRange = repositoryData.pullRequests.filter(
            pullRequest =>
                (from == undefined || pullRequest.createdAt >= from) && (to == undefined || pullRequest.createdAt <= to)
        )
        const smallPullRequests = pullRequestsInRange.filter(pr => pr.changedFiles <= 2)
        const mediumPullRequests = pullRequestsInRange.filter(pr => pr.changedFiles > 2 && pr.changedFiles <= 10)
        const largePullRequests = pullRequestsInRange.filter(pr => pr.changedFiles > 10)
        const toHour = 1 / (1000 * 60 * 60)
        datasets[0].data = [
            computeAveragePullRequestMergeTime(smallPullRequests) * toHour,
            computeAveragePullRequestMergeTime(mediumPullRequests) * toHour,
            computeAveragePullRequestMergeTime(largePullRequests) * toHour,
        ]
        datasets[1].data = [smallPullRequests.length, mediumPullRequests.length, largePullRequests.length]
    }
    return { labels, datasets }
}

/**
 * Generate datasets for the line chart of the dashboard.
 *
 * @param repositoryData pull requests and issues
 * @param from from date filter
 * @param to to date filter
 */
export const createDaySummaryDatasets = (repositoryData: RepositoryData, from: Date, to: Date) => {
    from = new Date(from)
    to = new Date(to)
    from.setHours(0, 0, 0, 0)
    to.setHours(0, 0, 0, 0)
    const days = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1
    const labels = new Array(days).fill(undefined).map((_, i) => {
        const date = new Date(from)
        date.setDate(from.getDate() + i)
        return date
    })
    let mergedPullRequests = []
    let createdPullRequests = []
    let closedPullRequests = []
    let createdIssues = []
    let closedIssues = []
    if (repositoryData != undefined) {
        mergedPullRequests = Array(days).fill(0)
        createdPullRequests = Array(days).fill(0)
        closedPullRequests = Array(days).fill(0)
        createdIssues = Array(days).fill(0)
        closedIssues = Array(days).fill(0)
        const dateToIndex = (date: Date) => {
            if (date == undefined) return -1
            const tempDate = new Date(date)
            tempDate.setHours(0, 0, 0, 0)
            return Math.round((tempDate.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
        }
        repositoryData.pullRequests.forEach(pullRequest => {
            const mergedAtIndex = dateToIndex(pullRequest.mergedAt)
            const createdAtIndex = dateToIndex(pullRequest.createdAt)
            const closedAtIndex = dateToIndex(pullRequest.closedAt)
            mergedPullRequests[mergedAtIndex] = (mergedPullRequests[mergedAtIndex] ?? 0) + 1
            createdPullRequests[createdAtIndex] = (createdPullRequests[createdAtIndex] ?? 0) + 1
            closedPullRequests[closedAtIndex] = (closedPullRequests[closedAtIndex] ?? 0) + 1
        })
        repositoryData.issues.forEach(issues => {
            const createdAtIndex = dateToIndex(issues.createdAt)
            const closedAtIndex = dateToIndex(issues.closedAt)
            createdIssues[createdAtIndex] = (createdIssues[createdAtIndex] ?? 0) + 1
            closedIssues[closedAtIndex] = (closedIssues[closedAtIndex] ?? 0) + 1
        })
        mergedPullRequests = mergedPullRequests.slice(0, days)
        createdPullRequests = createdPullRequests.slice(0, days)
        closedPullRequests = closedPullRequests.slice(0, days)
        createdIssues = createdIssues.slice(0, days)
        closedIssues = closedIssues.slice(0, days)
    }
    const pullRequestDatasets = [
        { label: 'Merged', data: mergedPullRequests, color: '#b20bff' },
        { label: 'Opened', data: createdPullRequests, color: '#ff3a00' },
        { label: 'Closed', data: closedPullRequests, color: '#13c600' },
    ]
    const issuesDatasets = [
        { label: 'Opened', data: createdIssues, color: '#ff3a00' },
        { label: 'Closed', data: closedIssues, color: '#13c600' },
    ]
    return { labels, pullRequestDatasets, issuesDatasets }
}
