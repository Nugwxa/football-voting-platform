import classNames from 'classnames'
import style from './Divider.module.css'

interface DividerProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string
  children?: string
}

/**
 * Renders a styled divider with optional centered text.
 *
 * @param {string} className - Additional class name to apply to the divider.
 * @param {string} children - Optional text to display inside the divider.
 *
 */
export default function Divider(props: Readonly<DividerProps>) {
  const { className, children, ...rest } = props
  return (
    <div className={classNames(className, style.divider)} {...rest}>
      {children && <span>{children}</span>}
    </div>
  )
}
