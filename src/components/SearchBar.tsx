import { useSearchParams } from '@solidjs/router'
import classes from './SearchBar.module.scss'

export const SearchBar = (props: { onSubmit?: (owner: string, repo: string) => void }) => {
    const [params, setParams] = useSearchParams<{ owner?: string; repo?: string }>()

    return (
        <form
            class={classes.root}
            onKeyPress={e => {
                if (e.key !== 'Enter') return
                if (!params.owner || !params.repo) return
                ;(document.activeElement as HTMLElement | undefined)?.blur()
                props.onSubmit?.(params.owner, params.repo)
            }}
        >
            <input
                value={params.owner ?? ''}
                onInput={e => setParams({ owner: e.target.value })}
                placeholder='Username or Organization'
            />
            <input
                value={params.repo ?? ''}
                onInput={e => setParams({ repo: e.target.value })}
                placeholder='Repository name'
            />
        </form>
    )
}
