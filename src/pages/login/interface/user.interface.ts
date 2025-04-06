import { SocialMedia } from "./social_media.interface";

export interface User {
  id: string;
  email?: string;
  username: string;
  profile_image: string;
  phone: string;
  role: string;
  social_medias: SocialMedia[];
}