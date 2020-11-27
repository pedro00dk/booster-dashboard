import { RepositoryData } from './api'

/**
 * Compute the average time taken to a pull request to be merged given a time range.
 * If there is no pull requests merged in the time range, -1 is returned.
 *
 * @param pullRequests repository pull requests
 * @param from beginning of the time range
 * @param to end of the time range
 */
const computeAveragePullRequestMergeTime = (pullRequests: RepositoryData['pullRequests'], from: Date, to: Date) => {
    const mergeTimes = pullRequests
        .filter(pr => pr.mergedAt != undefined && pr.mergedAt >= from && pr.mergedAt <= to)
        .map(pr => pr.mergedAt.getTime() - pr.createdAt.getTime())
    if (mergeTimes.length === 0) return -1
    return mergeTimes.reduce((acc, next) => acc + next, 0) / mergeTimes.length
}

/**
 * Compute the average time taken to a issue to be closed given a time range.
 * If there is no issues closed in the time range, -1 is returned.
 *
 * @param issues repository issues
 * @param from beginning of the time range
 * @param to end of the time range
 */
const computeAverageIssueCloseTime = (issues: RepositoryData['issues'], from: Date, to: Date) => {
    const closeTimes = issues
        .filter(issue => issue.closedAt != undefined && issue.closedAt >= from && issue.closedAt <= to)
        .map(issue => issue.closedAt.getTime() - issue.createdAt.getTime())
    if (closeTimes.length === 0) return -1
    return closeTimes.reduce((acc, next) => acc + next, 0) / closeTimes.length
}

/**
 * Compute all metrics to generate graphs and display messages of the dashboard.
 *
 * @param repositoryData repository issues and pull requests
 */
export const computeRepositoryMetrics = (repositoryData: RepositoryData, from: Date, to: Date) => {
    if (repositoryData == undefined) return { hasData: false }
    const smallPullRequests = repositoryData.pullRequests.filter(pr => pr.changedFiles <= 2)
    const mediumPullRequests = repositoryData.pullRequests.filter(pr => pr.changedFiles > 2 && pr.changedFiles <= 10)
    const largePullRequests = repositoryData.pullRequests.filter(pr => pr.changedFiles > 10)
    const averagePullRequestMergeTime = computeAveragePullRequestMergeTime(repositoryData.pullRequests, from, to)
    const averageSmallPullRequestMergeTime = computeAveragePullRequestMergeTime(smallPullRequests, from, to)
    const averageMediumPullRequestMergeTime = computeAveragePullRequestMergeTime(mediumPullRequests, from, to)
    const averageLargePullRequestMergeTime = computeAveragePullRequestMergeTime(largePullRequests, from, to)
    const averageIssueCloseTime = computeAverageIssueCloseTime(repositoryData.issues, from, to)
    const monthPullRequests = repositoryData.pullRequests.filter(pr => pr.createdAt >= from && pr.createdAt <= to)
    const monthIssues = repositoryData.issues.filter(issues => issues.createdAt >= from && issues.createdAt <= to)
    return {
        hasData: true,
        smallPullRequests,
        mediumPullRequests,
        largePullRequests,
        averagePullRequestMergeTime,
        averageSmallPullRequestMergeTime,
        averageMediumPullRequestMergeTime,
        averageLargePullRequestMergeTime,
        averageIssueCloseTime,
        monthPullRequests,
        monthIssues,
    }
}
