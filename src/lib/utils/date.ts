/**
 * Date formatting utilities
 * Handles both Firestore Timestamps and regular Date objects
 */

/**
 * Formats a timestamp to a readable date string
 * Handles both Firestore Timestamps and regular Date objects
 */
export const formatDate = (timestamp: unknown): string => {
  if (!timestamp) return 'N/A'
  
  // Handle Firestore Timestamp
  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
    const date = (timestamp as { toDate: () => Date }).toDate()
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  // Handle regular Date or string
  try {
    const date = new Date(timestamp as string | number | Date)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'N/A'
  }
};

/**
 * Formats a timestamp to a readable date and time string
 */
export const formatDateTime = (timestamp: unknown): string => {
  if (!timestamp) return 'N/A'
  
  // Handle Firestore Timestamp
  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
    const date = (timestamp as { toDate: () => Date }).toDate()
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Handle regular Date or string
  try {
    const date = new Date(timestamp as string | number | Date)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'N/A'
  }
};

/**
 * Formats a timestamp to a relative time string (e.g., "2 days ago")
 */
export const formatRelativeTime = (timestamp: unknown): string => {
  if (!timestamp) return 'N/A'
  
  let date: Date
  
  // Handle Firestore Timestamp
  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
    date = (timestamp as { toDate: () => Date }).toDate()
  } else {
    // Handle regular Date or string
    try {
      date = new Date(timestamp as string | number | Date)
    } catch {
      return 'N/A'
    }
  }
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
};

/**
 * Checks if a timestamp is today
 */
export const isToday = (timestamp: unknown): boolean => {
  if (!timestamp) return false
  
  let date: Date
  
  // Handle Firestore Timestamp
  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
    date = (timestamp as { toDate: () => Date }).toDate()
  } else {
    try {
      date = new Date(timestamp as string | number | Date)
    } catch {
      return false
    }
  }
  
  const today = new Date()
  return date.toDateString() === today.toDateString()
};

/**
 * Checks if a timestamp is within the last N days
 */
export const isWithinDays = (timestamp: unknown, days: number): boolean => {
  if (!timestamp) return false
  
  let date: Date
  
  // Handle Firestore Timestamp
  if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
    date = (timestamp as { toDate: () => Date }).toDate()
  } else {
    try {
      date = new Date(timestamp as string | number | Date)
    } catch {
      return false
    }
  }
  
  const now = new Date()
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diffInDays <= days
};
