import { ResetPasswordForm } from './client'
import authStyle from '../../auth.layout.module.css'
import Link from 'next/link'
import prisma from '@lib/prisma'

export default async function Page({
  params,
}: {
  params: { resetId: string }
}) {
  const resetToken = await prisma.resetToken.findUnique({
    where: {
      id: params.resetId,
    },
  })
  const now = new Date()
  if (!resetToken) return <h1>Invalid Token</h1>
  if (resetToken.isUsed) return <h1>Token Already Used</h1>
  if (resetToken.expiryDate < now)
    return (
      <div className={authStyle.contentContainer}>
        Token Expired
        <p className={authStyle.redirectText}>
          <Link className={authStyle.singleAnchor} href={'/auth/reset'}>
            Request a new link
          </Link>
        </p>
      </div>
    )
  return (
    <div className={authStyle.contentContainer}>
      <h1>Change Password</h1>
      <ResetPasswordForm resetTokenId={params.resetId} />
    </div>
  )
}
