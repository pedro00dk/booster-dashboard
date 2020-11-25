/**
 * API request utilities
 */

//
const api = 'https://api.github.com/graphql'
const token = '4caeda874612c18330494e53f562a4d0a11b9f4c' // public key without any authorization
const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Authorization: `bearer ${token}`,
}

/**
 * Helper to build graphql requests with abortion support.
 *
 * @param body graphql body
 * @returns a object containing the abort function and the request promise
 */
const sendGraphqlRequest = (body: string) => {
    const { abort, signal } = new AbortController()
    const promise = fetch(api, { method: 'POST', headers, body, signal })
    return { abort, promise }
}

/**
 * Search the github api for users and organizations with name similar to partialName.
 *
 * @param partialName partial user or organization name
 * @returns a object containing the abort function and the request promise
 */
export const searchUsersAndOrganizations = (partialName: string) => {
    const body = JSON.stringify({
        query: `
        query {
            search(type: USER, query: "${partialName}", last: 20) {
                repos: edges {
                    repo: node {
                        __typename
                        ... on Organization { login }
                        ... on User { login }
                    }
                }
            }
        }
        `,
    })
    return sendGraphqlRequest(body)
}

/**
 * Request pull request and issues information from the provided repository, up to the provided startDate.
 *
 * @param username user or organization name
 * @param repository repository name
 * @param startDate start date of pull requests
 * @returns list of pull requests
 */
export const queryRepositoryData = async (username: string, repository: string, startDate: Date) => {
    const queryBuilder = (cursor: string) =>
        JSON.stringify({
            query: `
        query {
            repository( owner: "${username}", name: "${repository}") {
                pullRequests(first: 25, orderBy: {field: CREATED_AT, direction: DESC}, after: ${cursor}) {
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
    const pullRequests = []
    let cursor = 'null'
    while (true) {
        const promise = fetch(api, { method: 'POST', headers, body: queryBuilder(cursor) })
        const response = await promise
        const content = await response.json()
        pullRequests.push(...content.data.repository.pullRequests.edges.map(pullRequest => pullRequest.node))
        const pageInfo = content.data.repository.pullRequests.pageInfo
        cursor = `"${pageInfo.endCursor}"`
        if (!pageInfo.hasNextPage) break
        const oldestPullRequest = pullRequests[pullRequests.length - 1]
        const beforeStartDate = new Date(oldestPullRequest.createdAt).getTime() - startDate.getTime() < 0
        if (beforeStartDate) break
    }
    return pullRequests
}
