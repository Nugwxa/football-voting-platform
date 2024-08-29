import { AlertTriangleIcon } from 'lucide-react'
import { readSession } from '@/lib/session'
import Callout from '@/components/Callout'
import ContentWrapper from '@/components/ContentWrapper'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const session = await readSession()

  // // Restrict access if the user is not authenticated
  // if (!session || !session.user.isAdmin)
  //   return (
  //     <ContentWrapper>
  //       <Callout title="Restricted Page!" icon={<AlertTriangleIcon />} isWide>
  //         You don't have the permission to view this page
  //       </Callout>
  //     </ContentWrapper>
  //   )
  return <>{children}</>
}
