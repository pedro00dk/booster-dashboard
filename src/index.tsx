import * as React from 'react'
import * as ReactDom from 'react-dom'
import 'regenerator-runtime/runtime'
import { Dashboard } from './view/Dashboard'

const root$ = document.getElementById('root')
ReactDom.render(<Dashboard />, root$)
