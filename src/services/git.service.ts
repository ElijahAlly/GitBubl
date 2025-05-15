import { StorageStructure, STORAGE_BUCKETS } from './storage.service';

class GitService {
  private readonly CHUNK_SIZE = 50 * 1024 * 1024 // 50MB

  constructor(private supabase: any) {}

  async storeRepository(repoId: string, gitData: Buffer) {
    if (gitData.length <= this.CHUNK_SIZE) {
      // Store small repo directly
      await this.supabase
        .storage
        .from(STORAGE_BUCKETS.REPOS)
        .upload(
          StorageStructure.getRepoPath(repoId),
          gitData,
          { upsert: true }
        )
    } else {
      // Split large repo into chunks
      const chunks = this.splitBuffer(gitData)
      const chunkPromises = chunks.map((chunk, index) => {
        const chunkId = `chunk_${index}`
        return this.supabase
          .storage
          .from(STORAGE_BUCKETS.CHUNKS)
          .upload(
            StorageStructure.getChunkPath(repoId, chunkId),
            chunk,
            { upsert: true }
          )
      })

      await Promise.all(chunkPromises)

      // Store chunk manifest
      await this.supabase
        .storage
        .from(STORAGE_BUCKETS.REPOS)
        .upload(
          StorageStructure.getRepoPath(repoId),
          JSON.stringify({
            chunks: chunks.length,
            size: gitData.length
          }),
          { upsert: true }
        )
    }
  }

  private splitBuffer(buffer: Buffer): Buffer[] {
    const chunks: Buffer[] = []
    for (let i = 0; i < buffer.length; i += this.CHUNK_SIZE) {
      chunks.push(buffer.slice(i, i + this.CHUNK_SIZE))
    }
    return chunks
  }
}

export { GitService };
