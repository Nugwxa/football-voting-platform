'use client'
import React from 'react'
import Select, { Props as SelectProps, GroupBase } from 'react-select'
interface OptionType {
  value: string
  label: string
}

interface ReactSelectProps
  extends SelectProps<OptionType, false, GroupBase<OptionType>> {}

export default function ReactSelect(props: Readonly<ReactSelectProps>) {
  return <Select {...props} />
}
