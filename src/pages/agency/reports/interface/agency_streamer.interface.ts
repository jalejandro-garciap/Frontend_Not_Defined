import { SocialConnectionStatus } from "./social_connection_status.interface";

export interface AgencyStreamer {
  id: string;
  name: string;
  imageUrl?: string;
  connectedSocials: SocialConnectionStatus;
}
