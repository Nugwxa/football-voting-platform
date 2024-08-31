import { redirect } from 'next/navigation'
import AuthNavButton from '../../_component/AuthNavButton'
import authStyle from '../../auth.layout.module.css'
import classNames from 'classnames'
import ConfirmPasswordResetForm from './_components/ConfirmPasswordResetForm'
import style from '../reset.module.css'
import supabaseServer from '@/lib/supabase/supabaseServer'

type SearchParams = {
  code?: string
}
interface ConfirmResetPageProps {
  searchParams?: SearchParams
}
export default async function Page(props: Readonly<ConfirmResetPageProps>) {
  const { searchParams } = props

  // Check if a reset code is provided in the URL's search parameters.
  if (searchParams?.code) {
    const supabase = supabaseServer()

    try {
      // Validate the reset code.
      const { error } = await supabase.auth.exchangeCodeForSession(
        searchParams.code
      )

      // Redirect to an error page if the code exchange fails.
      if (error) {
        console.error('Error exchanging code for session:', error) // Log the error for debugging.
        redirect('/auth/reset?error=invalid-token')
      }
    } catch (error) {
      // Catch any unexpected errors that occur during the code exchange process.
      console.error('Unexpected error during code exchange:', error) // Log the error for debugging.
      redirect('/auth/reset?error=unexpected-error')
    }
  } else {
    // Redirect to an error page if no reset code is found in the URL.
    redirect('/auth/reset?error=invalid-link')
  }
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
      <ConfirmPasswordResetForm />
    </div>
  )
}
