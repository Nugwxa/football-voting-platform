import style from './style.module.css'

export default function TextWithDivider({ children }: { children: any }) {
  return (
    <p className={style.dividerText}>
      <span>{children}</span>
    </p>
  )
}
