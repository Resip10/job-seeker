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
import { Profile, ProfileDoc } from './types';

const db = getFirestore(app);

// Create a new profile
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

// Get all profiles for a user
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

// Update a profile
export const updateProfile = async (
  profileId: string,
  updates: Partial<Profile>
): Promise<void> => {
  const profileRef = doc(db, 'profiles', profileId);
  await updateDoc(profileRef, updates);
};

// Delete a profile
export const deleteProfile = async (profileId: string): Promise<void> => {
  const profileRef = doc(db, 'profiles', profileId);
  await deleteDoc(profileRef);
};
