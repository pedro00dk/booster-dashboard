export type User = {
    login: string
    avatar_url: string
    html_url: string
}

export type Issue = {
    id: number
    number: number
    html_url: string
    state: 'open' | 'closed'
    title: string
    body: string
    user: User
    labels: [{ name: string; description: string; color: string }]
    pull_request?: { html_url: string; merged_at?: Date }
    created_at: Date
    updated_at: Date
    closed_at?: Date
}

const fetchIssues = async (owner: string, repo: string) => {
    const issues: Issue[] = await (await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all`)).json()
    issues.forEach(issue => {
        issue.created_at = new Date(issue.created_at)
        issue.updated_at = new Date(issue.updated_at)
        if (issue.closed_at) issue.closed_at = new Date(issue.closed_at)
        if (issue.pull_request?.merged_at) issue.pull_request.merged_at = new Date(issue.pull_request.merged_at)
    })
    return issues
}

export const issuesActions = { fetchIssues }

export const inRange = (issues: Issue[], from = new Date(-864e13), to = new Date(864e13)) =>
    issues.filter(({ created_at }) => created_at >= from && created_at <= to)

export const averageMergeTimeMillis = (issues: Issue[], from?: Date, to?: Date) =>
    inRange(issues, from, to)
        .filter(({ pull_request }) => pull_request?.merged_at)
        .map(({ created_at, pull_request }) => +pull_request!.merged_at! - +created_at)
        .reduce((acc, next, _, l) => acc + next / l.length, 0)

export const averageCloseTimeMillis = (issues: Issue[], from?: Date, to?: Date) =>
    inRange(issues, from, to)
        .filter(({ pull_request, closed_at }) => !pull_request && closed_at)
        .map(({ created_at, closed_at }) => +closed_at! - +created_at)
        .reduce((acc, next, _, l) => acc + next / l.length, 0)

// export const dailySummaryDatasets = (issues: Issue[], from: Date, to: Date) => {
//     from.setHours(0, 0, 0, 0)
//     to.setHours(0, 0, 0, 0)
//     const dayMillis = 1000 * 60 * 60 * 24
//     const days = [...Array((+to - +from) / dayMillis + 1)].map((_, i) => new Date(+from + dayMillis * i))
//     const buckets: Record<, Issue[][]> { created: Issue[][]; closed: Issue[][]; merged: Issue[][] } = {
//         created: [],
//         closed: [],
//         merged: [],
//     }
//     days.forEach((day, i, a) => {
//         const next = a[i + 1] ?? to
//         issues.filter(({ created_at }) => +day <= +created_at && +created_at < +next)
//     })

//     const dateToIndex = (date: Date) => {
//         if (date == undefined) return -1
//         const tempDate = new Date(date)
//         tempDate.setHours(0, 0, 0, 0)
//         return Math.round((tempDate.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
//     }
//     repositoryData.pullRequests.forEach(pullRequest => {
//         const mergedAtIndex = dateToIndex(pullRequest.mergedAt)
//         const createdAtIndex = dateToIndex(pullRequest.createdAt)
//         const closedAtIndex = dateToIndex(pullRequest.closedAt)
//         mergedPullRequests[mergedAtIndex] = (mergedPullRequests[mergedAtIndex] ?? 0) + 1
//         createdPullRequests[createdAtIndex] = (createdPullRequests[createdAtIndex] ?? 0) + 1
//         closedPullRequests[closedAtIndex] = (closedPullRequests[closedAtIndex] ?? 0) + 1
//     })
//     repositoryData.issues.forEach(issues => {
//         const createdAtIndex = dateToIndex(issues.createdAt)
//         const closedAtIndex = dateToIndex(issues.closedAt)
//         createdIssues[createdAtIndex] = (createdIssues[createdAtIndex] ?? 0) + 1
//         closedIssues[closedAtIndex] = (closedIssues[closedAtIndex] ?? 0) + 1
//     })
//     mergedPullRequests = mergedPullRequests.slice(0, days)
//     createdPullRequests = createdPullRequests.slice(0, days)
//     closedPullRequests = closedPullRequests.slice(0, days)
//     createdIssues = createdIssues.slice(0, days)
//     closedIssues = closedIssues.slice(0, days)

//     const pullRequestDatasets = [
//         { label: 'Merged', data: mergedPullRequests, color: '#b20bff' },
//         { label: 'Opened', data: createdPullRequests, color: '#ff3a00' },
//         { label: 'Closed', data: closedPullRequests, color: '#13c600' },
//     ]
//     const issuesDatasets = [
//         { label: 'Opened', data: createdIssues, color: '#ff3a00' },
//         { label: 'Closed', data: closedIssues, color: '#13c600' },
//     ]
//     return { labels, pullRequestDatasets, issuesDatasets }
// }
