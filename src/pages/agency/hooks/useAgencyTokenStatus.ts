import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkAgencyStreamersTokens, StreamerTokenStatus } from '../services/tokenService';

export const useAgencyTokenStatus = (agencyId: string | null) => {
  const [tokenStatusMap, setTokenStatusMap] = useState<Map<string, StreamerTokenStatus>>(new Map());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['agencyTokenStatus', agencyId],
    queryFn: () => agencyId ? checkAgencyStreamersTokens(agencyId) : Promise.resolve([]),
    enabled: !!agencyId,
    refetchInterval: 10 * 60 * 1000, // Check every 10 minutes
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });

  useEffect(() => {
    if (data) {
      const statusMap = new Map<string, StreamerTokenStatus>();
      data.forEach(streamerStatus => {
        statusMap.set(streamerStatus.streamerId, streamerStatus);
      });
      setTokenStatusMap(statusMap);
    }
  }, [data]);

  const getStreamerTokenStatus = (streamerId: string): StreamerTokenStatus | null => {
    return tokenStatusMap.get(streamerId) || null;
  };

  const hasExpiredTokens = (streamerId: string): boolean => {
    const streamerStatus = getStreamerTokenStatus(streamerId);
    if (!streamerStatus) return false;
    
    return streamerStatus.socialMedias.some(sm => 
      sm.tokenStatus.isExpiring || sm.tokenStatus.needsRefresh
    );
  };

  const getExpiredTokensCount = (streamerId: string): number => {
    const streamerStatus = getStreamerTokenStatus(streamerId);
    if (!streamerStatus) return 0;
    
    return streamerStatus.socialMedias.filter(sm => 
      sm.tokenStatus.isExpiring || sm.tokenStatus.needsRefresh
    ).length;
  };

  const getPlatformTokenStatus = (streamerId: string, platform: string) => {
    const streamerStatus = getStreamerTokenStatus(streamerId);
    if (!streamerStatus) return null;
    
    return streamerStatus.socialMedias.find(sm => 
      sm.platform.toLowerCase() === platform.toLowerCase()
    );
  };

  return {
    tokenStatusMap,
    isLoading,
    error,
    refetch,
    getStreamerTokenStatus,
    hasExpiredTokens,
    getExpiredTokensCount,
    getPlatformTokenStatus
  };
}; 