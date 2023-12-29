import { Accessor, JSX, createSignal, onCleanup, onMount } from 'solid-js'

export const D3Svg = (
    props: JSX.IntrinsicElements['svg'] & { draw?: (ref: SVGSVGElement, size: Accessor<ResizeObserverSize>) => void },
) => {
    let ref: SVGSVGElement = undefined as any
    const [size, setSize] = createSignal<ResizeObserverSize>({ blockSize: 0, inlineSize: 0 })
    const observer = new ResizeObserver(([{ contentBoxSize }]) => setSize(contentBoxSize[0] ?? size()))
    onMount(() => (observer.observe(ref), props.draw?.(ref, size)))
    onCleanup(observer.disconnect)

    return <svg {...props} ref={ref} />
}
