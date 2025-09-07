import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import app from '@/firebase/config';

const storage = getStorage(app);

// Upload file and return download URL
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Delete file from storage
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Generate unique file path for user uploads
export const generateUserFilePath = (userId: string, fileName: string): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `resumes/${userId}/${timestamp}_${sanitizedFileName}`;
};