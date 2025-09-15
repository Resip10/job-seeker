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
import { Job, IJobDoc } from './types';

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
