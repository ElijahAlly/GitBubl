export const useGithubConnect = () => {
  const clientId = process.env.NUXT_GITHUB_CLIENT_ID;
  const baseApiUrl = process.env.NUXT_BASE_API_URL;

  const connectGithub = () => {
    if (!clientId || !baseApiUrl) {
      return;
    }

    const params = new URLSearchParams({
      client_id:  clientId,
      redirect_uri: `${baseApiUrl}/auth/github/callback`,
      scope: 'read:user user:email', // Add more scopes as needed
      state: Math.random().toString(36).substring(7)
    })

    window.location.href = `https://github.com/login/oauth/authorize?${params}`
  }

  return {
    connectGithub
  }
}
