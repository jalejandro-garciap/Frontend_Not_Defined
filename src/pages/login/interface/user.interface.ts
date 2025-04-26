import { SocialMedia } from "./social_media.interface";

export interface User {
  id: string;
  email: string;
  username: string;
  profile_img: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  social_medias: SocialMedia[];
}