import { api } from "../../login/services/api";
import { TokenStatus } from "../../../utils/services/tokenService";

export interface StreamerTokenStatus {
  streamerId: string;
  streamerName: string;
  socialMedias: {
    id: string;
    platform: string;
    username: string;
    tokenStatus: TokenStatus;
  }[];
}

export const checkAgencyStreamersTokens = async (agencyId: string): Promise<StreamerTokenStatus[]> => {
  const response = await api.get(`/manager/agency-streamers-tokens/${agencyId}`);
  return response.data;
};

export const refreshStreamerToken = async (streamerId: string, platform: string) => {
  const response = await api.post(`/manager/refresh-streamer-token/${streamerId}/${platform}`);
  return response.data;
}; 