export interface AdminAgency {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at?: string;
  managerUserId?: string; // The ID of the user who manages this agency
}

export interface CreateAgencyDto {
  name: string;
  description?: string;
  active: boolean;
}

export interface UpdateAgencyDto {
  id: number;
  name?: string;
  description?: string;
  active?: boolean;
}

export type AgencyFormData = {
  name: string;
  description?: string;
  active: boolean;
};
