import { For, JSX } from 'solid-js'
import classes from './Tabs.module.scss'

export const Tabs = (
    props: JSX.IntrinsicElements['div'] & { tab?: string; onTab?: (tab: string) => void; children?: JSX.Element[] },
) => (
    <div {...props} class={`${classes.root} ${props.class ?? ''}`}>
        <For each={props.children?.filter(child => child instanceof HTMLElement && child.dataset.tab) as HTMLElement[]}>
            {child => (
                <button
                    class={child.dataset.tab === props.tab ? classes.selected : undefined}
                    onClick={() => props.onTab?.(child.dataset.tab!)}
                    children={child}
                />
            )}
        </For>
    </div>
)
