import { Timestamp } from "firebase/firestore";

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

// Profile types
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