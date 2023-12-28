import { Router } from '@solidjs/router'
import { render } from 'solid-js/web'
import './index.scss'
import { Dashboard } from './pages/Dashboard'

render(() => <Router root={Dashboard} />, document.body)
