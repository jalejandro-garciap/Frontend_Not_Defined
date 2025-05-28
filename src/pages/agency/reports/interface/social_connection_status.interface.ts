export interface SocialConnectionStatus {
  instagram: boolean;
  tiktok: boolean;
  youtube: boolean;
}

export interface SocialConnectionWithTokenStatus {
  instagram: {
    connected: boolean;
    tokenExpired?: boolean;
    username?: string;
  };
  tiktok: {
    connected: boolean;
    tokenExpired?: boolean;
    username?: string;
  };
  youtube: {
    connected: boolean;
    tokenExpired?: boolean;
    username?: string;
  };
}
