import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import app from '@/firebase/config';
import {
  Job,
  IJobDoc,
  Resume,
  ResumeDoc,
  Profile,
  ProfileDoc,
  UserProfile,
  UserProfileDoc,
} from './types';

const db = getFirestore(app);

// Create a new job
export const createJob = async (
  job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IJobDoc> => {
  const newJob = {
    ...job,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'jobs'), newJob);
  return { id: docRef.id, ...newJob };
};

// Get all jobs for a user
export const getJobsByUserId = async (userId: string): Promise<IJobDoc[]> => {
  const jobsRef = collection(db, 'jobs');
  const q = query(jobsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    doc =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as IJobDoc
  );
};

// Update a job
export const updateJob = async (
  jobId: string,
  updates: Partial<Job>
): Promise<void> => {
  const jobRef = doc(db, 'jobs', jobId);
  await updateDoc(jobRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Delete a job
export const deleteJob = async (jobId: string): Promise<void> => {
  const jobRef = doc(db, 'jobs', jobId);
  await deleteDoc(jobRef);
};

// Resume services
export const createResume = async (
  resume: Omit<Resume, 'id' | 'uploadedAt'>
): Promise<ResumeDoc> => {
  const newResume = {
    ...resume,
    uploadedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'resumes'), newResume);
  return { id: docRef.id, ...newResume };
};

export const getResumesByUserId = async (
  userId: string
): Promise<ResumeDoc[]> => {
  try {
    const resumesRef = collection(db, 'resumes');
    const q = query(
      resumesRef,
      where('userId', '==', userId),
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as ResumeDoc
    );
  } catch {
    return [];
  }
};

export const deleteResume = async (resumeId: string): Promise<void> => {
  const resumeRef = doc(db, 'resumes', resumeId);
  await deleteDoc(resumeRef);
};

// Profile services
export const createProfile = async (
  profile: Omit<Profile, 'id' | 'createdAt'>
): Promise<ProfileDoc> => {
  const newProfile = {
    ...profile,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'profiles'), newProfile);
  return { id: docRef.id, ...newProfile };
};

export const getProfilesByUserId = async (
  userId: string
): Promise<ProfileDoc[]> => {
  try {
    const profilesRef = collection(db, 'profiles');
    const q = query(
      profilesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      doc =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as ProfileDoc
    );
  } catch {
    return [];
  }
};

export const updateProfile = async (
  profileId: string,
  updates: Partial<Profile>
): Promise<void> => {
  const profileRef = doc(db, 'profiles', profileId);
  await updateDoc(profileRef, updates);
};

export const deleteProfile = async (profileId: string): Promise<void> => {
  const profileRef = doc(db, 'profiles', profileId);
  await deleteDoc(profileRef);
};

// User Profile services
export const createUserProfile = async (
  userProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<UserProfileDoc> => {
  const newUserProfile = {
    ...userProfile,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'userProfiles'), newUserProfile);
  return { id: docRef.id, ...newUserProfile };
};

export const getUserProfileByUserId = async (
  userId: string
): Promise<UserProfileDoc | null> => {
  try {
    const userProfilesRef = collection(db, 'userProfiles');
    const q = query(userProfilesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as UserProfileDoc;
  } catch {
    return null;
  }
};

export const updateUserProfile = async (
  userProfileId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  const userProfileRef = doc(db, 'userProfiles', userProfileId);
  await updateDoc(userProfileRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const deleteUserProfile = async (
  userProfileId: string
): Promise<void> => {
  const userProfileRef = doc(db, 'userProfiles', userProfileId);
  await deleteDoc(userProfileRef);
};
