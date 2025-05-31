export interface SocialLinkStatus {
  connected: boolean;
  isTokenExpired: boolean;
  username: string;
}

export interface SocialLinks {
  instagram?: SocialLinkStatus | string;
  tiktok?: SocialLinkStatus | string;
  youtube?: SocialLinkStatus | string;
}
