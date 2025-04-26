import { Agency } from "../store/agencyStore";
import { AffiliatedStreamer } from "../agency-streamers/interfaces/affiliated_streamer.interface";
import { PendingStreamer } from "../agency-streamers/interfaces/pending_streamer.interface";
import { api } from "../../login/services/api";

export const fetchManagerAgencies = async (): Promise<Agency[]> => {
  const { data } = await api.get("/manager/agencies");
  return data;
};

export const fetchAgencyStreamers = async (
  agencyId: string
): Promise<AffiliatedStreamer[]> => {
  const { data } = await api.get(`/manager/agency-streamers/${agencyId}`);
  return data;
};

export const fetchAgencyPendingStreamers = async (
  agencyId: string
): Promise<PendingStreamer[]> => {
  const { data } = await api.get(
    `/manager/agency-pending-streamers/${agencyId}`
  );
  return data;
};

export const removeStreamerFromAgency = async (
  agencyId: string,
  streamerId: string
): Promise<void> => {
  await api.delete(`/manager/remove-streamer/${agencyId}/${streamerId}`);
};

export const addStreamerToAgency = async (
  agencyId: string,
  streamerId: string
): Promise<void> => {
  await api.post(`/manager/add-streamer/${agencyId}`, { streamerId });
};

export const searchStreamer = async (
  agencyId: string,
  query: string
): Promise<AffiliatedStreamer[]> => {
  const { data } = await api.get(
    `/manager/search-streamer/${agencyId}/${query}`
  );
  return data;
};

export const createRequest = async (
  streamerId: string,
  agencyId: string,
  requestData: {
    startDate: string;
    endDate: string;
    comment?: string;
  }
): Promise<void> => {
  await api.post(
    `/manager/streamer-request/${agencyId}/${streamerId}`,
    requestData
  );
};

export const generateReport = async (
  socialMedia: "instagram" | "tiktok" | "youtube",
  format: "pdf" | "csv",
  reportData: {
    startDate?: string;
    endDate?: string;
    hashtags?: string[];
    streamerIds: string[];
  }
): Promise<Blob> => {
  const { data } = await api.post<Blob>(
    `/manager/streamer-report`,
    reportData,
    {
      params: { socialMedia, format },
      responseType: "blob",
    }
  );

  return data;
};
