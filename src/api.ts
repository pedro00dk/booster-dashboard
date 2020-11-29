const api = 'https://api.github.com/graphql'
const token = '4caeda874612c18330494e53f562a4d0a11b9f4c' // public key without any authorization
const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Authorization: `bearer ${token}`,
}

/**
 * Wrapper to throw errors with graphql data.
 * This error is used when fetches do not fail but contain graphql errors.
 */
export class GraphQlError extends Error {
    constructor(public errors) {
        super('graphql error')
    }
}

/**
 * Helper function to fetch large graphql collections using cursors with abortion support.
 *
 * @param buildQuery function to build a query that only takes the current cursor
 * @param getPageInfo obtain the pageInfo from the current iteration result
 * @param stopPredicate checks if process should stop based on the current result
 * @param signal abort signal for cancellation purposes
 */
const graphqlFetchCollection = async (
    buildQuery: (cursor: string) => string,
    getPageInfo: (result: any) => { hasNextPage: boolean; endCursor: string },
    stopPredicate: (result: any) => boolean,
    signal?: AbortSignal
) => {
    const results = []
    let cursor = 'null'
    while (true) {
        const response = await fetch(api, { method: 'POST', headers, signal, body: buildQuery(cursor) })
        const result = await response.json()
        if (result.errors != undefined) throw new GraphQlError(result.errors)
        results.push(result)
        const pageInfo = getPageInfo(result)
        if (!pageInfo.hasNextPage || stopPredicate(result)) break
        cursor = `"${pageInfo.endCursor}"`
    }
    return results
}

/**
 * Fetch issues and pull requests from the provided repository until a issue or pull request creation date reaches
 * startDate.
 * This function fetches issues and pull requests in different queries which run in parallel.
 * It would be more complicated to track two cursors for different collections in the same query.
 *
 * @param username user or organization name
 * @param repository repository name
 * @param startDate start date of issues and pull requests
 * @returns promise that yields issues and pull requests, and the abort trigger
 */
export const fetchRepositoryData = (username: string, repository: string, startDate: Date) => {
    const abortController = new AbortController()
    const issuesPromise = graphqlFetchCollection(
        fetchIssuesQuery(username, repository),
        result => result.data.repository.issues.pageInfo,
        result => {
            const lastIssue = result.data.repository.issues.edges.slice(-1)[0].node
            return new Date(lastIssue.createdAt).getTime() - startDate.getTime() < 0
        },
        abortController.signal
    )
    const pullRequestsPromise = graphqlFetchCollection(
        fetchPullRequestsQuery(username, repository),
        result => result.data.repository.pullRequests.pageInfo,
        result => {
            const lastPullRequest = result.data.repository.pullRequests.edges.slice(-1)[0].node
            return new Date(lastPullRequest.createdAt).getTime() - startDate.getTime() < 0
        },
        abortController.signal
    )
    const promise = Promise.all([issuesPromise, pullRequestsPromise]).then(results => {
        const issues = results[0]
            .flatMap(result => result.data.repository.issues.edges)
            .map(issue => issue.node)
            .map(({ createdAt, closedAt }) => ({
                createdAt: createdAt && new Date(createdAt),
                closedAt: closedAt && new Date(closedAt),
            }))
        const pullRequests = results[1]
            .flatMap(result => result.data.repository.pullRequests.edges)
            .map(pullRequest => pullRequest.node)
            .map(({ createdAt, closedAt, mergedAt, changedFiles, commits }) => ({
                createdAt: createdAt && new Date(createdAt),
                closedAt: closedAt && new Date(closedAt),
                mergedAt: mergedAt && new Date(mergedAt),
                changedFiles: changedFiles as number,
                commits: commits.totalCount as number,
            }))
        return { issues, pullRequests }
    })
    return { promise, abort: () => abortController.abort() }
}

export type RepositoryDataPromise = ReturnType<typeof fetchRepositoryData>['promise']
export type RepositoryData = RepositoryDataPromise extends PromiseLike<infer T> ? T : RepositoryDataPromise

// graphql query builders

const fetchIssuesQuery = (username: string, repository: string) => (cursor: string) =>
    JSON.stringify({
        query: `
query {
    repository( owner: "${username}", name: "${repository}") {
        issues(first: 100, orderBy: {field: CREATED_AT, direction: DESC}, after: ${cursor}) {
            edges { node { createdAt closedAt } }
            pageInfo { endCursor hasNextPage }
        }
    }
}`,
    })

const fetchPullRequestsQuery = (username: string, repository: string) => (cursor: string) =>
    JSON.stringify({
        query: `
query {
    repository( owner: "${username}", name: "${repository}") {
        pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: DESC}, after: ${cursor}) {
            edges {
                node {
                    createdAt closedAt mergedAt changedFiles
                    commits { totalCount }
                }
            }
            pageInfo { endCursor hasNextPage }
        }
    }
}`,
    })
