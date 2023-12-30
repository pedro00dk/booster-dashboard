import { Router } from '@solidjs/router'
import { Dashboard } from './Dashboard'
import classes from './Index.module.scss'

export const Entrypoint = () => {
    return <Router root={Index} base={import.meta.env.BASE_URL}></Router>
}

export const Index = () => <div class={classes.root}>{<Dashboard />}</div>
