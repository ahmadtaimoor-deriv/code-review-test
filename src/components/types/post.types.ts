export interface Post {
  id: string;
  content: string;
  scheduledTime?: Date;
  images: string[];
  status: 'draft' | 'scheduled' | 'published';
  analytics?: PostAnalytics;
}

export interface PostAnalytics {
  views: number;
  likes: number;
  shares: number;
  engagement: number;
}

export interface DraftAutoSave {
  content: string;
  lastSaved: Date;
  images: string[];
}

export interface PostScheduleConfig {
  timeSlots: Date[];
  blackoutPeriods: { start: Date; end: Date }[];
  maxPostsPerDay: number;
}

export interface ImageUpload {
  file: File;
  preview: string;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
}
