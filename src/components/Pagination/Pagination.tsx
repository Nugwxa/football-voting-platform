'use client'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import Button from '../Button'
import classNames from 'classnames'
import styles from './Pagination.module.css'

interface PaginationProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  totalPages: number
}

/**
 * Renders a pagination component that allows users to navigate between pages.
 * It updates the "page" URL query parameter to reflect the current page.
 *
 *
 * @param {number} totalPages - The total number of pages available.
 * @param {string} className - Additional class names for styling.
 */
export default function Pagination(props: Readonly<PaginationProps>) {
  const { totalPages, className, ...rest } = props
  const router = useRouter()

  const [currentPage, setCurrentPage] = React.useState(1)

  // Initialize the current page based on the URL query parameter
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = parseInt(params.get('page') ?? '1')
    // Set the current page, ensuring it's at least 1
    setCurrentPage(page > 0 ? page : 1)
  }, [router])

  /**
   * Handles the click event for page buttons.
   * Updates the URL and sets the current page state.
   *
   * @param {number} page - The page number to navigate to.
   */
  function handleClick(page: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page.toString())
    // Push the new page to the router
    router.push(`${window.location.pathname}?${params.toString()}`)
    setCurrentPage(page)
  }

  /**
   * Handles the click event for the previous page button.
   * Decrements the current page if not on the first page.
   */
  function handlePrevious() {
    if (currentPage > 1) {
      handleClick(currentPage - 1)
    }
  }

  /**
   * Handles the click event for the next page button.
   * Increments the current page if not on the last page.
   */
  function handleNext() {
    if (currentPage < totalPages) {
      handleClick(currentPage + 1)
    }
  }

  /**
   * Renders the pagination buttons including ellipses for large ranges.
   */
  function renderPages() {
    const pages = []
    const maxPagesToShow = 5 // Maximum number of pages to display at a time
    const maxVisiblePages = maxPagesToShow - 2 // Number of pages to show between ellipses

    // Determine startPage and endPage for the visible range of pages
    let startPage = 1
    let endPage = totalPages

    if (totalPages > maxPagesToShow) {
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        // If the current page is near the start, show the first few pages
        endPage = maxPagesToShow - 1
      } else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
        // If the current page is near the end, show the last few pages
        startPage = totalPages - maxVisiblePages
        endPage = totalPages
      } else {
        // Otherwise, show a range centered around the current page
        startPage = currentPage - Math.floor(maxVisiblePages / 2)
        endPage = currentPage + Math.floor(maxVisiblePages / 2)
      }
    }

    // Add the first page and an ellipsis if the startPage is greater than 1
    if (startPage > 1) {
      pages.push(
        <Button
          mode="border"
          key={1}
          className={classNames(styles.paginationButton, {
            [styles.active]: currentPage === 1,
          })}
          onClick={() => handleClick(1)}
        >
          1
        </Button>
      )
      if (startPage > 2) {
        pages.push(
          <Button
            mode="border"
            className={styles.paginationButton}
            disabled
            key="ellipsis-start"
          >
            ...
          </Button>
        )
      }
    }

    // Add the range of page numbers determined by startPage and endPage
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          mode="border"
          key={i}
          onClick={() => handleClick(i)}
          className={classNames(styles.paginationButton, {
            [styles.active]: i === currentPage,
          })}
        >
          {i}
        </Button>
      )
    }

    // Add an ellipsis and the last page if endPage is less than totalPages
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <Button
            mode="border"
            className={styles.paginationButton}
            disabled
            key="ellipsis-end"
          >
            ...
          </Button>
        )
      }
      pages.push(
        <Button
          className={classNames(styles.paginationButton, {
            [styles.active]: totalPages === currentPage,
          })}
          mode="border"
          key={totalPages}
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </Button>
      )
    }

    return pages
  }

  return (
    <div className={classNames(styles.paginationWrapper, className)} {...rest}>
      <div className={classNames(styles.pagination)}>
        {/* Previous Button */}
        <Button
          mode="border"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          icon={<ChevronLeftIcon />}
        >
          {null}
        </Button>

        {/* Render the dynamic page numbers */}
        {renderPages()}

        {/* Next Button */}
        <Button
          mode="border"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          icon={<ChevronRightIcon />}
        >
          {null}
        </Button>
      </div>
    </div>
  )
}
