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
 * Request pull request and issues information from the provided repository.
 *
 * @param username user or organization name
 * @param repository repository name
 * @returns a object containing the abort function and the request promise
 */
export const queryRepositoryData = (username: string, repository: string) => {
    const body = JSON.stringify({
        query: `
        query {
            repository(owner: "${username}", name: "${repository}") {
                pullRequests(last: 10) {
                    nodes {
                        createdAt
                        closed
                        closedAt
                        merged
                        mergedAt
                        changedFiles
                        commits {
                            totalCount
                        }
                    }
                }
            }
        }`,
    })
    return sendGraphqlRequest(body)
}
