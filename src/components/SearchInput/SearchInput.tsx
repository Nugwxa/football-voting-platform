'use client'
import { SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import styles from './SearchInput.module.css'

interface SearchInputProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  placeholder?: string
}

/**
 * Renders a search input with a debounced query update mechanism.
 *
 * The search query is synchronized with the URL query parameter `query`,
 *
 * @param  {string} className - Optional additional class names to apply to the component wrapper
 */
export default function SearchInput(props: Readonly<SearchInputProps>) {
  const { className, placeholder = 'Search ...', ...rest } = props

  // Reference to the input field for handling focus
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus on the input when the icon is clicked
  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const paramName = 'query'
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get(paramName) || ''
  )

  useEffect(() => {
    // Debounce logic to delay the update of the query parameter in the URL
    const debounceDelayTime = 500
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) {
        params.set('page', '1')
        params.set(paramName, searchQuery)
      } else {
        params.delete(paramName)
      }

      // Replace the URL with the updated search query
      router.replace(`?${params.toString()}`)
    }, debounceDelayTime)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, router, searchParams])

  // Handle input changes and update the search query state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  return (
    <div className={classNames(className, styles.searchInputWrapper)} {...rest}>
      <SearchIcon
        size={16}
        onClick={handleIconClick}
        className={styles.inputIcon}
      />
      <input
        className={styles.inputField}
        onChange={handleInputChange}
        placeholder={placeholder}
        defaultValue={searchQuery}
        ref={inputRef}
        type="text"
      />
    </div>
  )
}
