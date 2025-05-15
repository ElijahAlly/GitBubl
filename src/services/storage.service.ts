export const STORAGE_BUCKETS = {
  REPOS: 'git-repos',        // Main repository data
  CHUNKS: 'git-chunks',      // Large file chunks
  REFS: 'git-refs',         // Branches and tags
  OBJECTS: 'git-objects',   // Git objects (commits, trees, blobs)
  TEMP: 'git-temp'          // Temporary storage for operations
} as const;

export class StorageStructure {
  // Example paths:
  // git-repos/{repo_id}/info
  // git-chunks/{repo_id}/{chunk_id}
  // git-refs/{repo_id}/heads/{branch_name}
  // git-objects/{repo_id}/{object_hash}
  // git-temp/{repo_id}/{operation_id}

  static getRepoPath(repoId: string) {
    return `${repoId}/info`;
  }

  static getChunkPath(repoId: string, chunkId: string) {
    return `${repoId}/${chunkId}`;
  }

  static getRefPath(repoId: string, refName: string) {
    return `${repoId}/heads/${refName}`;
  }

  static getObjectPath(repoId: string, objectHash: string) {
    // Use first two chars as directory for better distribution
    const prefix = objectHash.substring(0, 2);
    return `${repoId}/${prefix}/${objectHash}`;
  }
}
