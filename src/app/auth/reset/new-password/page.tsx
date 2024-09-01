import { notFound } from 'next/navigation'
import { readSession } from '@/lib/session'
import AuthNavButton from '../../_component/AuthNavButton'
import authStyle from '../../auth.layout.module.css'
import classNames from 'classnames'
import ConfirmPasswordResetForm from './_components/ConfirmPasswordResetForm'
import style from '../reset.module.css'

type SearchParams = {
  redirect?: string
}
interface ConfirmResetPageProps {
  searchParams: SearchParams
}
export default async function Page(props: Readonly<ConfirmResetPageProps>) {
  const session = await readSession()
  if (!session) return notFound()
  const { searchParams } = props

  const redirectTo = searchParams.redirect

  return (
    <div className={authStyle.authContentContainer}>
      <div
        className={classNames(
          authStyle.authNavButtonPositioning,
          style.resetPasswordButtonWrapper
        )}
      >
        <AuthNavButton label="Change Password" href="" isActive />
      </div>
      <ConfirmPasswordResetForm redirectTo={redirectTo} />
    </div>
  )
}
