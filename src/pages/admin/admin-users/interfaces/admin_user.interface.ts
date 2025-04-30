export interface AdminUser {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  username: string;
  profile_img: string;
  phone: string;
  role: string;
  managerOnSponsors?: ManagerAssignment[];
  streamerOnSponsors?: StreamerAssignment[];
  agencyAssignments?: AgencyAssignment[]; // Combined assignments from API
}

interface ManagerAssignment {
  id: string;
  sponsorId: string;
  since: string;
  sponsor?: {
    id: string;
    name: string;
    description: string;
  };
}

interface StreamerAssignment {
  id: string;
  sponsorId: string;
  since: string;
  sponsor?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface AgencyAssignment {
  id: string;
  userId: string;
  agencyId: string;
  role: string;
  since: string;
  agency?: {
    id: string;
    name: string;
    description: string;
    active: boolean;
  };
}

export interface AssignAgencyDto {
  userId: string;
  agencyId: string;
  role?: string;
}

export interface AssignmentFormData {
  agencyId: string;
  role: string;
}
