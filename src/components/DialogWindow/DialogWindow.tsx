'use client'
import * as Dialog from '@radix-ui/react-dialog'
import classNames from 'classnames'
import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import styles from './DialogWindow.module.css'
interface DialogWindowProps extends React.ComponentPropsWithoutRef<'div'> {
  trigger: JSX.Element
  children?: ReactNode
  windowTitle: string
  windowDescription?: string
  windowIsOpen?: boolean
  setWindowIsOpen: Dispatch<SetStateAction<boolean>>
}

/**
 * A dialog window component based on Radix UI's Dialog component.
 *
 * @param {JSX.Element} trigger - The element that triggers the dialog when clicked.
 * @param {ReactNode} [children] - The content of the dialog.
 * @param {string} windowTitle - The title of the dialog window.
 * @param {string} [windowDescription] - Optional description text displayed below the title.
 * @param {boolean} [windowIsOpen] - Controls whether the dialog is open or closed.
 * @param {Dispatch<SetStateAction<boolean>>} setWindowIsOpen - Function to control the open state of the dialog.
 * @param {string} [className] - Optional additional class name(s) for the dialog content.
 */
export default function DialogWindow(props: Readonly<DialogWindowProps>) {
  const {
    trigger,
    children,
    className,
    windowDescription,
    windowTitle,
    windowIsOpen,
    setWindowIsOpen,
    ...rest
  } = props
  return (
    <Dialog.Root onOpenChange={(e) => setWindowIsOpen(e)} open={windowIsOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content
          className={classNames(className, styles.DialogContent)}
          {...rest}
        >
          <Dialog.Title className={styles.DialogTitle}>
            {windowTitle}
          </Dialog.Title>
          {windowDescription && (
            <Dialog.Description className={styles.DialogDescription}>
              {windowDescription}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
