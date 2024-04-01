import style from './style.module.css'

export default function TextWithDivider({ children }: { children: any }) {
  // TODO: Make Color A Prop
  return (
    <p className={style.dividerText}>
      <span>{children}</span>
    </p>
  )
}
