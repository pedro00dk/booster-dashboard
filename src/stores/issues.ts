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
    pull_request?: { html_url: string }
    created_at: string
    updated_at: string
    closed_at?: string
}

const fetchIssues = async (owner: string, repo: string) =>
    (await (await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all`)).json()) as Issue[]

export const issuesActions = { fetchIssues }
