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
  writeBatch
} from "firebase/firestore";
import app from '@/firebase/config';

// Import local utilities and types
import { 
  IJobData, 
  IJobDoc, 
  IJobQueryOptions, 
  IJobBatchOperation 
} from './types';
import { COLLECTIONS } from './constants';
import { handleFirestoreError } from './error-handling';
import { validateJobData, validateJobId, validateUserId, validateBatchOperations } from './validation';
import { 
  extractJobData, 
  buildQueryConstraints, 
  extractJobsFromSnapshot,
  validateBatchOperation,
  createIdQuery,
  isQueryEmpty,
  getFirstDocument,
  getQuerySize
} from './utils';

// Database instance
const db = getFirestore(app);

// Main CRUD operations
export const createJob = async (
  job: Omit<IJobData, 'createdAt' | 'updatedAt'>, 
  userId: string
): Promise<IJobDoc> => {
  try {
    validateJobData(job);
    validateUserId(userId);
    
    const newJob: IJobData = {
      ...job,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.JOBS), newJob);
    return { id: docRef.id, ...newJob };
  } catch (error) {
    return handleFirestoreError(error, 'job creation');
  }
};

export const getJobsByUserId = async (
  userId: string, 
  options: IJobQueryOptions = {}
): Promise<IJobDoc[]> => {
  try {
    validateUserId(userId);

    const jobsRef = collection(db, COLLECTIONS.JOBS);
    const constraints = buildQueryConstraints(userId, options);
    const q = query(jobsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return extractJobsFromSnapshot(querySnapshot);
  } catch (error) {
    return handleFirestoreError(error, 'job retrieval');
  }
};

export const updateJob = async (
  jobId: string, 
  updates: Partial<IJobData>
): Promise<void> => {
  try {
    validateJobId(jobId);
    
    const jobRef = doc(db, COLLECTIONS.JOBS, jobId);
    const updateData = { 
      ...updates, 
      updatedAt: Timestamp.now() 
    };
    
    await updateDoc(jobRef, updateData);
  } catch (error) {
    return handleFirestoreError(error, 'job update');
  }
};

export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    validateJobId(jobId);
    
    const jobRef = doc(db, COLLECTIONS.JOBS, jobId);
    await deleteDoc(jobRef);
  } catch (error) {
    return handleFirestoreError(error, 'job deletion');
  }
};

// Advanced operations
export const batchJobOperations = async (operations: IJobBatchOperation[]): Promise<void> => {
  try {
    validateBatchOperations(operations);
    
    const batch = writeBatch(db);
    
    operations.forEach((operation) => {
      validateBatchOperation(operation);
      
      switch (operation.type) {
        case 'create':
          const newJob: IJobData = {
            ...operation.data!,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };
          const docRef = doc(collection(db, COLLECTIONS.JOBS));
          batch.set(docRef, newJob);
          break;
          
        case 'update':
          const updateRef = doc(db, COLLECTIONS.JOBS, operation.id!);
          batch.update(updateRef, { 
            ...operation.updates!, 
            updatedAt: Timestamp.now() 
          });
          break;
          
        case 'delete':
          const deleteRef = doc(db, COLLECTIONS.JOBS, operation.id!);
          batch.delete(deleteRef);
          break;
      }
    });
    
    await batch.commit();
  } catch (error) {
    return handleFirestoreError(error, 'batch operations');
  }
};

export const getJobById = async (jobId: string): Promise<IJobDoc | null> => {
  try {
    validateJobId(jobId);
    
    const jobsRef = collection(db, COLLECTIONS.JOBS);
    const q = query(jobsRef, createIdQuery(COLLECTIONS.JOBS, jobId));
    const jobSnap = await getDocs(q);
    
    if (isQueryEmpty(jobSnap)) {
      return null;
    }
    
    const firstDoc = getFirstDocument(jobSnap);
    return firstDoc ? extractJobData(firstDoc) : null;
  } catch (error) {
    return handleFirestoreError(error, 'job retrieval by ID');
  }
};

// Utility functions
export const getJobsCount = async (userId: string): Promise<number> => {
  try {
    validateUserId(userId);
    
    const jobsRef = collection(db, COLLECTIONS.JOBS);
    const q = query(jobsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return getQuerySize(querySnapshot);
  } catch (error) {
    return handleFirestoreError(error, 'job count retrieval');
  }
};