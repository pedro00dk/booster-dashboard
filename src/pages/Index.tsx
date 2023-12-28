import { Router } from '@solidjs/router'
import { Dashboard } from './Dashboard'
import classes from './Index.module.scss'

export const Entrypoint = () => <Router root={Index}></Router>

export const Index = () => <div class={classes.root}>{<Dashboard />}</div>
