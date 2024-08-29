'use client'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../Button'
import styles from './TableSortToggle.module.css'

interface TableSortToggleProps
  extends React.ComponentPropsWithoutRef<'button'> {
  text: string
  topKey: string
  bottomKey: string
  defaultToTop?: boolean
}

/**
 * Renders a toggle button that allows users to sort a tables result in ascending or descending order.
 * Updates the URL query parameters to reflect the current sort order.
 *
 * @param {string} text - The label text displayed on the button.
 * @param {string} topKey - The key used for ascending order in the sort query.
 * @param {string} bottomKey - The key used for descending order in the sort query.
 * @param {boolean} defaultToTop - If true, defaults the sort order to ascending on initial load.
 */
export default function TableSortToggle(props: Readonly<TableSortToggleProps>) {
  const { text, topKey, bottomKey, defaultToTop, className, ...rest } = props

  const router = useRouter()
  const searchParams = useSearchParams()
  const paramName = 'sort'

  // Get the current sort key from URL parameters
  const currentSortKey = searchParams.get(paramName)

  // Set the initial sort key state
  const initialSortKey = currentSortKey || (defaultToTop ? topKey : '')
  const [sortKey, setSortKey] = useState(initialSortKey)

  // Sync the sort key with the URL parameters on load or when they change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    setSortKey(params.get(paramName) ?? '')
  }, [currentSortKey])

  // Determine which sort order is active and set its icon
  const topIsActive = sortKey === topKey || (defaultToTop && sortKey === '')
  const bottomIsActive = sortKey === bottomKey
  const iconSize = 13
  const activeStrokeWidth = !topIsActive && !bottomIsActive ? 1 : 3
  const iconOpacity = !topIsActive && !bottomIsActive ? 0.7 : 1

  // Set the icon based on the current sort state
  let arrowIcon = topIsActive ? (
    <ChevronUpIcon
      size={iconSize}
      strokeWidth={activeStrokeWidth}
      opacity={iconOpacity}
    />
  ) : (
    <ChevronDownIcon
      size={iconSize}
      strokeWidth={activeStrokeWidth}
      opacity={iconOpacity}
    />
  )

  /**
   * Handles the button click event to toggle the sort order.
   * Updates the URL parameters and internal state accordingly.
   */
  function handleButtonClick() {
    const params = new URLSearchParams(searchParams.toString())

    if (topIsActive) {
      params.set(paramName, bottomKey)
      setSortKey(bottomKey)
    } else if (bottomIsActive && defaultToTop === true) {
      params.set(paramName, topKey)
      setSortKey(topKey)
    } else if (bottomIsActive) {
      setSortKey('')
      params.delete(paramName)
    } else {
      params.set(paramName, topKey)
      setSortKey(topKey)
    }

    router.replace(`?${params.toString()}`)
  }

  return (
    <Button
      onClick={handleButtonClick}
      className={styles.button}
      mode="transparent"
      {...rest}
    >
      {text} {arrowIcon}
    </Button>
  )
}
