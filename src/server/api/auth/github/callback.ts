import { createError, defineEventHandler, getQuery, H3Event, sendRedirect } from 'h3';
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const code = query.code as string;

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.NUXT_GITHUB_CLIENT_ID || '',
      client_secret: process.env.NUXT_GITHUB_CLIENT_SECRET || '',
      code
    })
  })

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Get GitHub user data
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  const githubUser = await userResponse.json()

  // Get the current user from the session
  const { supabaseClient } = event.context
  const { data: { session } } = await supabaseClient.auth.getSession()

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Create service role client
  const supabaseServiceRole = createClient(
    process.env.NUXT_SUPABASE_URL || '',
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY || '', // Make sure this is set in your .env
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Store the connection in external_accounts
  const { error } = await supabaseServiceRole
    .from('external_accounts')
    .upsert({
      user_id: session.user.id,
      provider: 'github',
      provider_user_id: githubUser.id.toString(),
      access_token: accessToken,
      expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null
    })

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to store GitHub connection'
    })
  }

  // Redirect back to the app
  return sendRedirect(event, '/settings/connections')
})
