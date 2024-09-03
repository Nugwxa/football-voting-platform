import { notFound } from 'next/navigation'
import { readSession } from '@/lib/session'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await readSession()

  // Restrict access if the user is not authenticated
  if (!session || !session.user.isAdmin) return notFound()
  return <>{children}</>
}
