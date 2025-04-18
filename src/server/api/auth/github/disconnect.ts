import { createError, defineEventHandler, type H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const { supabaseClient } = event.context
  const { data: { session } } = await supabaseClient.auth.getSession()

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const { error } = await supabaseClient
    .from('external_accounts')
    .delete()
    .eq('user_id', session.user.id)
    .eq('provider', 'github')

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to disconnect GitHub account'
    })
  }

  return { success: true }
})
