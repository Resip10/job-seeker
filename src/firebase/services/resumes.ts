import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import app from '@/firebase/config';
import { Resume, ResumeDoc } from './types';

const db = getFirestore(app);

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

// Get all resumes for a user
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

// Delete a resume
export const deleteResume = async (resumeId: string): Promise<void> => {
  const resumeRef = doc(db, 'resumes', resumeId);
  await deleteDoc(resumeRef);
};
