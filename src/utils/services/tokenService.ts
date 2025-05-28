import { api } from "../../pages/login/services/api";

export interface TokenStatus {
  id: string;
  platform: string;
  username: string;
  tokenExpiresAt: string | null;
  isExpiring: boolean;
  needsRefresh: boolean;
}

export interface SocialMediaWithTokenStatus {
  id: string;
  social_media_name: string;
  username: string;
  enabled: boolean;
  last_connection: string;
  created_at: string;
  updated_at: string;
  tokenStatus?: TokenStatus;
}

export const checkTokenExpiration = async (socialMediaId: string): Promise<TokenStatus> => {
  const response = await api.get(`/auth/tokens/check/${socialMediaId}`);
  return response.data;
};

export const validateToken = async (socialMediaId: string) => {
  const response = await api.post(`/auth/tokens/validate/${socialMediaId}`);
  return response.data;
};

export const getExpiredTokens = async () => {
  const response = await api.get('/auth/tokens/expired');
  return response.data;
};

export const checkAllUserTokens = async (socialMedias: Array<{id: string}>) => {
  const tokenStatuses = await Promise.allSettled(
    socialMedias.map(async (sm) => {
      try {
        return await checkTokenExpiration(sm.id);
      } catch (error) {
        console.error(`Error checking token for ${sm.id}:`, error);
        return null;
      }
    })
  );

  return tokenStatuses.map((result, index) => ({
    socialMediaId: socialMedias[index].id,
    tokenStatus: result.status === 'fulfilled' ? result.value : null
  }));
}; 