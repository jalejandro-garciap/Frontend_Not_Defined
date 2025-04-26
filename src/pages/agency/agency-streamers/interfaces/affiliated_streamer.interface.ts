import { SocialLinks } from "./social_link.interface";

export interface AffiliatedStreamer {
  id: string;
  name: string;
  imageUrl?: string;
  connectedSocials: SocialLinks;
}
