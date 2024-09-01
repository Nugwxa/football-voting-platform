'use server'
import { CreateUserDTO } from './types'
import { getUser } from './getUser'
import prisma from '@/lib/prisma'
import supabaseAdmin from '@/lib/supabase/supabaseAdmin'
import supabaseServer from '@/lib/supabase/supabaseServer'

export async function createUser(
  newUser: Readonly<CreateUserDTO>
): Promise<ActionResponse> {
  const { email, name, password } = newUser
  const existingUser = await getUser({ userEmail: email })

  if (existingUser) {
    return { type: 'error', message: 'Email in use' }
  }

  const supabase = supabaseServer()

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Error signing up:', error)
    return { type: 'error', message: error.message }
  }

  if (!user || !user.email) {
    console.error('Error creating user in databse:', { user })

    if (user?.id) {
      await deleteIncompleteUser(user.id)
    }

    return {
      type: 'error',
      message: 'Error creating user in databse: Email is missing',
    }
  }

  await prisma.user.create({
    data: { id: user.id, email: user.email, name },
  })

  return { type: 'success', message: 'Account created!' }
}

async function deleteIncompleteUser(userId: string) {
  try {
    await supabaseAdmin().auth.admin.deleteUser(userId)
  } catch (error) {
    console.error('Error deleting incomplete user from Supabase:', error)
  }
}
