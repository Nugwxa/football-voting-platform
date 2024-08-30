'use client'
import { formatLabel } from '@/utils/'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './Countdown.module.css'

interface CountdownProps extends React.ComponentPropsWithoutRef<'div'> {
  targetDate: Date
}

/**
 * Countdown component that displays the time remaining until a target date.
 *
 * @param {Date} targetDate - The target date for the countdown.
 * @returns {JSX.Element | null} The Countdown component or null if no time is left.
 */
export default function Countdown(props: Readonly<CountdownProps>) {
  const { targetDate, className, ...rest } = props
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  // Update the time left every second
  useEffect(() => {
    // Initialize time left when component mounts
    setTimeLeft(calculateTimeLeft(targetDate))

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  // Only render if timeLeft is calculated
  if (!timeLeft) return null

  return (
    <div className={classNames(className, styles.countdownContainer)} {...rest}>
      {/* Days remaining */}
      <div className={styles.timeSegment}>
        <div className={styles.timeValue}>{timeLeft.days} </div>
        {formatLabel(timeLeft.days, 'Day')}
      </div>

      {/* Hours remaining */}
      <div className={styles.timeSegment}>
        <div className={styles.timeValue}>{timeLeft.hours} </div>
        {formatLabel(timeLeft.hours, 'Hour')}
      </div>

      {/* Minutes remaining */}
      <div className={styles.timeSegment}>
        <div className={styles.timeValue}>{timeLeft.minutes} </div>
        {formatLabel(timeLeft.minutes, 'Min')}
      </div>

      {/* Seconds remaining */}
      <div className={styles.timeSegment}>
        <div className={styles.timeValue}>{timeLeft.seconds} </div>
        {formatLabel(timeLeft.seconds, 'Sec')}
      </div>
    </div>
  )
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Calculates the time remaining until a specified date.
 *
 * @param {Date} date - The target date to count down to.
 * @returns {TimeLeft} An object containing days, hours, minutes, and seconds left.
 */
function calculateTimeLeft(date: Date): TimeLeft {
  // Calculate the difference between the target date and the current time
  const difference = +new Date(date) - +new Date()

  // Initialize default time left values
  let timeLeft: TimeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }

  // If the target date is in the future, calculate the remaining time
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  return timeLeft
}
