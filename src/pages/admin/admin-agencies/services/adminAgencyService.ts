import { api } from "../../../login/services/api";
import {
  AdminAgency,
  CreateAgencyDto,
} from "../interfaces/admin_agency.interface";

export const fetchAllAgencies = async (): Promise<AdminAgency[]> => {
  const { data } = await api.get<AdminAgency[]>("/admin/agencies");
  return data;
};

export const createAgency = async (
  agencyData: CreateAgencyDto
): Promise<AdminAgency> => {
  const { data } = await api.post<AdminAgency>("/admin/agencies", agencyData);
  return data;
};

export const updateAgency = async (
  agencyId: string,
  agencyData: Partial<CreateAgencyDto>
): Promise<AdminAgency> => {
  const { data } = await api.put<AdminAgency>(
    `/admin/agencies/${agencyId}`,
    agencyData
  );
  return data;
};
