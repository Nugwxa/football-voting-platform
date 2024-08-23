'use client'
import React from 'react'
import * as RadixPopover from '@radix-ui/react-popover'
import styles from './Popover.module.css'

interface PopoverProps extends React.ComponentPropsWithoutRef<'div'> {
  trigger: JSX.Element
}

export default function Popover(props: Readonly<PopoverProps>) {
  const { trigger, children, className, ...rest } = props

  return (
    <RadixPopover.Root {...rest}>
      <RadixPopover.Trigger>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content className={styles.PopoverContent} sideOffset={5}>
          <div className={className}>{children}</div>
          <RadixPopover.Arrow className={styles.PopoverArrow} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
