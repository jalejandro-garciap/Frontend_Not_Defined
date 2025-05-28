export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface SocialLinksWithStatus {
  instagram?: {
    username: string;
    connected: boolean;
    tokenExpired?: boolean;
  };
  tiktok?: {
    username: string;
    connected: boolean;
    tokenExpired?: boolean;
  };
  youtube?: {
    username: string;
    connected: boolean;
    tokenExpired?: boolean;
  };
}
