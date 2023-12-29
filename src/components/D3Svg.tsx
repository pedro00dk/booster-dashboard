import { Accessor, JSX, createSignal, onCleanup, onMount } from 'solid-js'
import classes from './D3Svg.module.scss'

export const D3Svg = (
    props: JSX.IntrinsicElements['div'] & {
        draw?: (div: HTMLDivElement, svg: SVGSVGElement, size: Accessor<ResizeObserverSize>) => void
    },
) => {
    let div: HTMLDivElement = undefined as any
    let svg: SVGSVGElement = undefined as any
    const [size, setSize] = createSignal<ResizeObserverSize>({ blockSize: 0, inlineSize: 0 })
    const observer = new ResizeObserver(([{ contentBoxSize }]) => setSize(contentBoxSize[0] ?? size()))
    onMount(() => (observer.observe(svg), props.draw?.(div, svg, size)))
    onCleanup(observer.disconnect)

    return (
        <div {...props} ref={div} class={`${classes.root} ${props.class ?? ''}`}>
            <svg ref={svg} />
        </div>
    )
}
