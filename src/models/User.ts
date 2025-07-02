import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    favoriteGenres?: string[];
    favoriteArtists?: string[];
    favoritePodcasts?: string[];
  };
  isGuest?: boolean;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {
  password?: never;
}

export interface UserPreferences {
  favoriteGenres?: string[];
  favoriteArtists?: string[];
  favoritePodcasts?: string[];
} 