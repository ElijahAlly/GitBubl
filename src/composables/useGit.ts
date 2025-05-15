import { giteaService } from '~/services/gitea.service';
import { useSupabase } from '~/lib/supabase';

export function useGit() {
  const createRepository = async (name: string, description: string, isPrivate: boolean) => {
    try {
      const supabase = useSupabase();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) throw new Error('Not authenticated');

      // Create repository in Gitea
      const repo: any = await giteaService.createRepo(
        session.user.user_metadata.username,
        name,
        session.access_token,
        isPrivate
      );

      // Store repository info in Supabase
      await supabase
        .from('repositories')
        .insert({
          id: repo.id,
          name: repo.name,
          description,
          is_private: isPrivate,
          owner_id: session.user.id,
          gitea_url: repo.html_url
        });

      return repo;
    } catch (error) {
      console.error('Failed to create repository:', error);
      throw error;
    }
  };

  const listRepositories = async (username: string) => {
    try {
      const supabase = useSupabase();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) throw new Error('Not authenticated');

      // Get repositories from Gitea
      const repos = await giteaService.listUserRepos(
        username,
        session.access_token
      );

      return repos;
    } catch (error) {
      console.error('Failed to list repositories:', error);
      throw error;
    }
  };

  return {
    createRepository,
    listRepositories
  };
}
