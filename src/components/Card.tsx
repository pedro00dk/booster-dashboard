import { JSX } from 'solid-js'
import classes from './Card.module.scss'

export const Card = (props: { title?: string; children?: JSX.Element }) => (
    <section class={classes.root}>
        {props.title && <header>{props.title}</header>}
        {props.title && <hr />}
        {props.children}
    </section>
)
