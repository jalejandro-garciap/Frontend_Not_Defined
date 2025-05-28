import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkAllUserTokens, TokenStatus } from '../services/tokenService';

interface SocialMedia {
  id: string;
  social_media_name: string;
  username: string;
  enabled: boolean;
}

export const useTokenStatus = (socialMedias: SocialMedia[]) => {
  const [tokenStatuses, setTokenStatuses] = useState<Map<string, TokenStatus>>(new Map());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tokenStatuses', socialMedias.map(sm => sm.id).join(',')],
    queryFn: () => checkAllUserTokens(socialMedias),
    enabled: socialMedias.length > 0,
    refetchInterval: 5 * 60 * 1000, // Recheck every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  useEffect(() => {
    if (data) {
      const statusMap = new Map<string, TokenStatus>();
      data.forEach(({ socialMediaId, tokenStatus }) => {
        if (tokenStatus) {
          statusMap.set(socialMediaId, tokenStatus);
        }
      });
      setTokenStatuses(statusMap);
    }
  }, [data]);

  const getTokenStatus = (socialMediaId: string): TokenStatus | null => {
    return tokenStatuses.get(socialMediaId) || null;
  };

  const isTokenExpired = (socialMediaId: string): boolean => {
    const status = getTokenStatus(socialMediaId);
    return status ? status.isExpiring || status.needsRefresh : false;
  };

  const getSocialMediaDisplayStatus = (socialMedia: SocialMedia) => {
    const tokenStatus = getTokenStatus(socialMedia.id);
    
    if (!socialMedia.enabled) {
      return { 
        status: 'disconnected' as const, 
        needsAction: false,
        message: 'Desconectado'
      };
    }

    if (!tokenStatus) {
      return { 
        status: 'unknown' as const, 
        needsAction: true,
        message: 'Estado desconocido'
      };
    }

    if (tokenStatus.isExpiring || tokenStatus.needsRefresh) {
      return { 
        status: 'expired' as const, 
        needsAction: true,
        message: 'Token expirado - Reconectar necesario'
      };
    }

    return { 
      status: 'connected' as const, 
      needsAction: false,
      message: 'Conectado'
    };
  };

  return {
    tokenStatuses,
    isLoading,
    error,
    refetch,
    getTokenStatus,
    isTokenExpired,
    getSocialMediaDisplayStatus
  };
}; 