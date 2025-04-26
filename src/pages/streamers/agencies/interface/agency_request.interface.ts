import { Agency } from "./agency.interface";

export interface AgencyRequest {
  id: string;
  agency: Agency;
  startDate: string;
  endDate: string;
  comment: string;
  status: "pending" | "accepted" | "rejected";
}
