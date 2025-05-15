export class GiteaService {
  private baseUrl: string;
  private adminToken: string;

  constructor() {
    const config = useRuntimeConfig();
    this.baseUrl = config.gitea.url;
    this.adminToken = config.gitea.token;
  }

  private async fetch(endpoint: string, options: any = {}) {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    return await $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `token ${options.token || this.adminToken}`
      }
    });
  }

  // User Management
  async createUser(email: string, username: string, password: string) {
    return await this.fetch('/admin/users', {
      method: 'POST',
      body: {
        email,
        username,
        password_hash: password, // In production, use proper password hashing
        must_change_password: false
      }
    });
  }

  async createUserToken(username: string, tokenName: string) {
    return await this.fetch(`/users/${username}/tokens`, {
      method: 'POST',
      body: {
        name: tokenName
      }
    });
  }

  // Repository Management
  async createRepo(username: string, name: string, token: string, isPrivate = false) {
    return await this.fetch('/user/repos', {
      method: 'POST',
      token,
      body: {
        name,
        private: isPrivate,
        auto_init: true
      }
    });
  }

  async getRepo(owner: string, repo: string, token: string = this.adminToken) {
    return await this.fetch(`/repos/${owner}/${repo}`, {
      token
    });
  }

  async listUserRepos(username: string, token: string) {
    return await this.fetch(`/users/${username}/repos`, {
      token
    });
  }

  async getRepositoryPack(owner: string, repo: string) {
    const response: any = await this.fetch(`/repos/${owner}/${repo}/archive/master.zip`, {
      responseType: 'arrayBuffer'
    });

    return {
      packData: Buffer.from(response)
    };
  }
}

export const giteaService = new GiteaService();
