import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import app from '@/firebase/config';
import { UserProfile, UserProfileDoc } from './types';

const db = getFirestore(app);

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
