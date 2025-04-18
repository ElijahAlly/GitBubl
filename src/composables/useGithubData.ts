import { useSupabase } from "~/lib/supabase";

export const useGithubData = () => {
  const supabase = useSupabase();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const getGithubConnection = async () => {
    const { data, error } = await supabase
      .from('external_accounts')
      .select('*')
      .eq('user_id', user.value?.id)
      .eq('provider', 'github')
      .single();

    if (error) throw error
    return data
  }

  const fetchGithubData = async () => {
    const connection = await getGithubConnection();
    if (!connection) return null;

    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${connection.access_token}`
      }
    })
    return await response.json()
  }

  return {
    getGithubConnection,
    fetchGithubData
  }
}
