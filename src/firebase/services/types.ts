import { Timestamp } from 'firebase/firestore';

// Simple types for MVP
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Job {
  id?: string;
  userId: string;
  title: string;
  company: string;
  link?: string;
  status: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IJobDoc extends Job {
  id: string;
}

// Resume types
export interface Resume {
  id?: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Timestamp;
}

export interface ResumeDoc extends Resume {
  id: string;
}

// User Profile types
export interface UserProfile {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  portfolioUrl?: string;
  profileImageUrl?: string;
  resumeUrl?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfileDoc extends UserProfile {
  id: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

// Profile links types (keeping existing for backward compatibility)
export interface Profile {
  id?: string;
  userId: string;
  platform: string;
  profileUrl: string;
  notes: string;
  createdAt: Timestamp;
}

export interface ProfileDoc extends Profile {
  id: string;
}
