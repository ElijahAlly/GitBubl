export interface GitAuth {
  name: string
  email: string
  user_id: string
}

export interface GitRepository {
  id: string;
  name: string;
  owner_id: string;
  description?: string;
  is_private: boolean;
  gitea_url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GitCommit {
  hash: string
  message: string
  author: GitAuth
  timestamp: Date
  repo_id: string
}
