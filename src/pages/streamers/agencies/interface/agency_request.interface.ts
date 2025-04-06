import { Agency } from "./agency.interface";

export interface AgencyRequest {
  id: string;
  agency: Agency;
  contractEndDate: string;
  comments: string;
  status: "pending" | "accepted" | "rejected";
}
