'use client'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import classNames from 'classnames'
import styles from './Pagination.module.css'

interface PaginationProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  maxItems?: number
  totalPages: number
}

export default function Pagination(props: Readonly<PaginationProps>) {
  const { totalPages, maxItems = 3, className, ...rest } = props
  // router to handle URL changes
  const router = useRouter()

  const [currentPage, setCurrentPage] = React.useState(1)

  // Sets the current page based on the URL query parameter
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = parseInt(params.get('page') ?? '1')

    setCurrentPage(page > 0 ? page : 1)
  }, [router])

  // Handles button clicks and updates the URL query parameter
  function handleClick(page: any) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page)
    router.push(`${window.location.pathname}?${params.toString()}`)
    setCurrentPage(page)
  }

  // Handles clicks for the "Previous" & "Next" button
  function handlePrevious() {
    // Reset page if user is on an invalid page
    if (currentPage > 1 && currentPage <= totalPages) {
      handleClick(currentPage - 1)
    } else {
      handleClick(1)
    }
  }

  function handleNext() {
    // Reset page if user is on an invalid page
    if (currentPage >= 1 && currentPage < totalPages) {
      handleClick(currentPage + 1)
    } else {
      handleClick(1)
    }
  }

  // Render pagination buttons with ellipsis for large page ranges
  function renderPages() {
    const pages = []

    const halfMax = Math.floor((maxItems - 1) / 2)
    let startPage = Math.max(1, currentPage - halfMax)
    let endPage = Math.min(totalPages, currentPage + halfMax)

    // Adjust startPage and endPage if they exceed the bounds
    if (endPage - startPage + 1 < maxItems) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxItems - 1)
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxItems + 1)
      }
    }

    // Render the first page and ellipsis if needed
    if (startPage > 1 && startPage <= totalPages) {
      pages.push(
        <button
          className={classNames(styles.paginationButton, styles.middleButton)}
          key={1}
          onClick={() => handleClick(1)}
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span
            className={classNames(styles.paginationButton, styles.ellipsis)}
            key="start-ellipsis"
          >
            ..
          </span>
        )
      }
    }

    // Render the middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            if (currentPage !== i) handleClick(i)
          }}
          className={classNames(styles.paginationButton, styles.middleButton, {
            [styles.activePage]: i === currentPage,
          })}
        >
          {i}
        </button>
      )
    }

    // Render ellipsis and the last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span
            className={classNames(styles.paginationButton, styles.ellipsis)}
            key="end-ellipsis"
          >
            ..
          </span>
        )
      }
      pages.push(
        <button
          className={classNames(styles.paginationButton, styles.middleButton)}
          key={totalPages}
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </button>
      )
    }

    return pages
  }

  return (
    <div className={classNames(styles.pagination, className)} {...rest}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        <ChevronLeftIcon size={13} /> Previous
      </button>
      {renderPages()}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Next <ChevronRightIcon size={13} />
      </button>
    </div>
  )
}
