import { css } from '@emotion/css'
import * as React from 'react'

const classes = {
    container: css({
        width: '100%',
        padding: '0.6em',
        fontSize: '4em',
        textAlign: 'center',
    }),
}

/**
 * Small component to display time labels.
 * This component shows days hours and minutes resolution.
 * If the time is shorter than one day, the day part is not shown.
 *
 * @param props.time time to be displayed
 */
export const TimeDisplay = (props: { time?: number }) => {
    /**
     * Format time to string.
     *
     * @param time time to format
     */
    const timeToDisplayString = (time: number) => {
        if (props.time == undefined) return '\u200b' // vertical space character
        if (typeof time !== 'number' || isNaN(time)) return 'Not a Number'
        if (!isFinite(time)) return time.toString()
        const sign = Math.sign(time)
        time = Math.abs(time)
        const minutes = Math.floor((time / (1000 * 60)) % 60)
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
        const days = Math.floor(time / (1000 * 60 * 60 * 24))
        const dayString = days > 0 ? `${days}day${days != 1 ? 's' : ''}` : ''
        const hourString = `${hours}h${minutes < 10 ? '0' : ''}${minutes}m`
        return `${dayString} ${hourString} ${sign < 0 ? 'remaining' : ''}`.trim()
    }

    return <span className={classes.container}>{timeToDisplayString(props.time)}</span>
}
