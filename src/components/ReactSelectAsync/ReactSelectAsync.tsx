'use client'
import { AsyncProps } from 'react-select/async'
import { Props as SelectProps, GroupBase } from 'react-select'
import AsyncSelect from 'react-select/async'
import classNames from 'classnames'
import React from 'react'
import styles from './ReactSelectAsync.module.css'

interface OptionType {
  value: string
  label: string
}

interface ReactSelectProps
  extends SelectProps<OptionType, boolean, GroupBase<OptionType>>,
    AsyncProps<OptionType, boolean, GroupBase<OptionType>> {}

/**
 * React select async wrapper component
 */
export default function ReactSelectAsync(props: Readonly<ReactSelectProps>) {
  const { className, ...rest } = props
  return (
    <AsyncSelect
      className={classNames(className, styles.select)}
      // Override styling
      classNames={{
        placeholder: (state) => {
          return styles.placeholder
        },
        input: (state) => {
          return styles.input
        },
        container: (state) => {
          return styles.container
        },
        control: (state) => {
          return styles.control
        },
        option: (state) => {
          return classNames(styles.option, {
            [styles.optionSelected]: state.isSelected,
            [styles.optionFocused]: state.isFocused,
          })
        },
        multiValue: (state) => {
          return styles.multiValue
        },
        multiValueLabel: (state) => {
          return styles.multiValueGeneric
        },
        multiValueRemove: (state) => {
          return styles.multiValueRemove
        },
        clearIndicator: (state) => {
          return styles.clearIndicator
        },
        indicatorSeparator: (state) => {
          return styles.indicatorSeparator
        },
        dropdownIndicator: (state) => {
          return styles.dropdownIndicator
        },
      }}
      {...rest}
    />
  )
}
