import { Timestamp } from 'firebase/firestore';
import type {
  LanguageProficiency,
  SalaryPeriod,
} from '@/lib/constants/profile';

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
  headline?: string;
  yearsOfExperience?: number;
  languages?: Language[];
  workAuthorization?: string;
  certifications?: Certification[];
  availabilityStatus?: string;
  noticePeriod?: string;
  jobPreferences?: JobPreferences;
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

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface SalaryExpectation {
  min?: number;
  max?: number;
  currency: string;
  period: SalaryPeriod;
}

export interface JobPreferences {
  workMode?: string[];
  jobTypes?: string[];
  desiredJobTitle?: string;
  salaryExpectation?: SalaryExpectation;
  willingToRelocate?: boolean;
  preferredLocations?: string[];
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
