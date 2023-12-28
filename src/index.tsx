import { css } from '@emotion/css'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import 'regenerator-runtime/runtime'
import './stores/issues'
import { Dashboard } from './view/Dashboard'

// override default user agent stylesheet properties
document.getElementsByTagName('body').item(0).className = css({ margin: 0, padding: 0 })

const root$ = document.getElementById('root')
ReactDom.render(<Dashboard />, root$)
