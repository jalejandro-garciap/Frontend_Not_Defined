import { api } from "../../../login/services/api";
import { Agency } from "../interface/agency.interface";
import { AgencyRequest } from "../interface/agency_request.interface";

export const AgencyService = {
  async getAffiliatedAgencies(): Promise<Agency[]> {
    try {
      const { data } = await api.get("/streamer/agency-affiliates");
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getPendingRequests(): Promise<AgencyRequest[]> {
    try {
      const { data } = await api.get("/streamer/agency-requests");
      return data;
    } catch (error) {
      throw error;
    }
  },

  async acceptRequest(requestId: string): Promise<void> {
    try {
      await api.patch(`/streamer/agency-requests/${requestId}/accept`);
    } catch (error) {
      throw error;
    }
  },

  async rejectRequest(requestId: string): Promise<void> {
    try {
      await api.patch(`/streamer/agency-requests/${requestId}/reject`);
    } catch (error) {
      throw error;
    }
  },
};
