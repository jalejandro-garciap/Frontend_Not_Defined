export interface SocialMedia {
  id: string;
  social_media_name: string;
  last_connection: string;
  username: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  token_expires_at?: string | null;
  isTokenExpired?: boolean;
}
