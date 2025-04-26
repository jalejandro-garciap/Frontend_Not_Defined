import { SocialLinks } from "./social_link.interface";

export interface SearchResultStreamer {
  id: string;
  name: string;
  imageUrl?: string;
  socialUsernames?: SocialLinks;
}
