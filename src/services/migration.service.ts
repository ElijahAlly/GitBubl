import type { GitService } from './git.service';
import { giteaService } from './gitea.service';

export class MigrationService {
  constructor(
    private supabase: any,
    private gitService: GitService
  ) {}

  async migrateRepository(username: string, repoName: string) {
    try {
      // Get repository from Gitea
      const repo: any = await giteaService.getRepo(username, repoName);

      // Store repository info in Supabase
      const { data, error } = await this.supabase
        .from('repositories')
        .insert({
          name: repo.name,
          description: repo.description,
          is_private: repo.private,
          owner_id: repo.owner.id,
          gitea_url: repo.html_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at
        })
        .select()
        .single();

      if (error) throw error;

      // Clone and pack repository for Supabase storage
      const { packData } = await giteaService.getRepositoryPack(username, repoName);
      await this.gitService.storeRepository(data.id, packData);

      return data;
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}
