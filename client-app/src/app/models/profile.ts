export interface Profile {
  displayName: string;
  username: string;
  bio: string;
  image: string;
  photos: Photo[];
  following: boolean;
  followersCount: number;
  followingsCount: number;
}

export interface ProfileFormValues extends Partial<Profile> {
  displayName: string;
  bio: string;
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
