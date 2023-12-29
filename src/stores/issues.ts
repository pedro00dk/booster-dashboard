import { UTCDate } from '@date-fns/utc'
import { eachDayOfInterval, startOfDay } from 'date-fns'

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
    created_at: UTCDate
    updated_at: UTCDate
    closed_at?: UTCDate
}

const fetchIssues = async (owner: string, repo: string) => {
    const api = 'https://api.github.com'
    const url = (page: number) => `${api}/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`
    const issues = (await Promise.all([1, 2, 3, 4].map(i => fetch(url(i)).then(r => r.json())))).flat() as Issue[]
    issues.forEach(issue => {
        issue.created_at = new UTCDate(issue.created_at)
        issue.updated_at = new UTCDate(issue.updated_at)
        if (issue.closed_at) issue.closed_at = new UTCDate(issue.closed_at)
        if (issue.pull_request?.merged_at) issue.pull_request.merged_at = new UTCDate(issue.pull_request.merged_at)
    })
    return issues
}

export const issuesActions = { fetchIssues }

export const inRange = (issues: Issue[], start = new Date(-864e13), end = new Date(864e13)) =>
    issues.filter(({ created_at }) => created_at >= start && created_at <= end)

export const averageMergeTimeMillis = (issues: Issue[], start?: Date, end?: Date) =>
    inRange(issues, start, end)
        .filter(({ pull_request }) => pull_request?.merged_at)
        .map(({ created_at, pull_request }) => +pull_request!.merged_at! - +created_at)
        .reduce((acc, next, _, l) => acc + next / l.length, 0)

export const averageCloseTimeMillis = (issues: Issue[], start?: Date, end?: Date) =>
    inRange(issues, start, end)
        .filter(({ pull_request, closed_at }) => !pull_request && closed_at)
        .map(({ created_at, closed_at }) => +closed_at! - +created_at)
        .reduce((acc, next, _, l) => acc + next / l.length, 0)

export const dailySummaryDatasets = (issues: Issue[], start: Date, end: Date) => {
    const days = eachDayOfInterval({ start, end })
    const [first, second] = days
    const d = +second - +first
    const groups: Record<string, number[]> = {
        created: Array(days.length).fill(0),
        closed: Array(days.length).fill(0),
        merged: Array(days.length).fill(0),
    }
    const colors: Record<string, string> = { created: '#ff3a00', closed: '#13c600', merged: '#b20bff' }
    issues.forEach(({ created_at, closed_at, pull_request }) => {
        const merged_at = pull_request?.merged_at
        if (created_at >= start && created_at < end) groups.created[(+startOfDay(created_at) - +first) / d]++
        if (closed_at && closed_at >= start && closed_at < end) groups.closed[(+startOfDay(closed_at) - +first) / d]++
        if (merged_at && merged_at >= start && merged_at < end) groups.merged[(+startOfDay(merged_at) - +first) / d]++
    })
    return { days, groups, colors }
}
