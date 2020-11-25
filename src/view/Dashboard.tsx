import { css } from '@emotion/css'
import * as React from 'react'
import { Card } from './Card'
import { ColumnChart } from './charts/ColumnChart'
import { SearchBar } from './SearchBar'

const classes = {
    container: `d-flex flex-column w-100 ${css({
        background: '#f1f2f5',
        color: 'black',
    })}`,
    row: `d-flex flex-wrap ${css({
        padding: '-0.75em',
    })}`,
    col: `d-flex flex-column ${css({
        padding: '0.75em',
    })}`,
    display: css({
        fontSize: '4em',
        padding: '0.45em',
        width: '100%',
        textAlign: 'center',
    }),
}

export const Dashboard = () => (
    <div className={classes.container}>
        <SearchBar />
        <div className={classes.col}>
            <Card label='Average Merge Time by Pull Request Size'>
                <div style={{ width: '100%', height: '28em' }}>
                    <ColumnChart />
                </div>
            </Card>
            <div className={classes.row}>
                <Card label='Average Pull Request Merge Time'>
                    <span className={classes.display}>1day 2h30m</span>
                </Card>
                <Card label='Average Issue Close Time'>
                    <span className={classes.display}>5days 3h25m</span>
                </Card>
            </div>
            <Card label='Month Summary'>
                <div style={{ height: '32em' }}></div>
            </Card>
        </div>
        <span style={{ height: '3.5em' }} />
    </div>
)
