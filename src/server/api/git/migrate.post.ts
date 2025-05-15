import { serverSupabaseServiceRole } from '#supabase/server';
import { MigrationService } from '~/services/migration.service';
import { GitService } from '~/services/git.service';

export default defineEventHandler(async (event) => {
  try {
    const { username, repository } = await readBody(event);

    const supabase = serverSupabaseServiceRole(event);
    const gitService = new GitService(supabase);
    const migrationService = new MigrationService(supabase, gitService);

    const result = await migrationService.migrateRepository(username, repository);

    return {
      success: true,
      repository: result
    };
  } catch (error) {
    console.error('Migration failed:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to migrate repository'
    });
  }
});
