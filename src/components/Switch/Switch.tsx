'use client'

import * as RadixSwitch from '@radix-ui/react-switch'
import style from './Switch.module.css'
interface SwitchProps {
  name?: string
  onChange?: (checked: boolean) => void
  checked?: boolean
  required?: boolean
  defaultChecked?: boolean
}

/**
 * A custom switch component based on Radix UI's Switch component.
 *
 * @param {string} name - The name of the switch input, used for form submissions.
 * @property {function} onChange - optional callback function triggered when the switch state changes.
 * @property {boolean} checked - optional controlled checked state of the switch.
 * @property {boolean} required - Indicates whether the switch is required in a form.
 * @property {boolean} defaultChecked - Initial checked state of the switch when uncontrolled.
 *
 */
export default function Switch(props: Readonly<SwitchProps>) {
  const { name, onChange, checked, required, defaultChecked = false } = props
  return (
    <RadixSwitch.Root
      className={style.SwitchRoot}
      id={name}
      name={name}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onChange}
      required={required}
    >
      <RadixSwitch.Thumb className={style.SwitchThumb} />
    </RadixSwitch.Root>
  )
}
