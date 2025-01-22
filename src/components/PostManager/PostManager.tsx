import { useState, useCallback, useMemo, useEffect } from 'react';
import { usePostScheduler } from '../hooks/usePostScheduler';
import { useAutoDraft } from '../hooks/useAutoDraft';
import { Post, PostAnalytics, ImageUpload } from '../types/post.types';
import './PostManager.css';

interface PostManagerProps {
  initialPosts?: Post[];
  onPostScheduled?: (post: Post) => void;
  onPostPublished?: (post: Post) => void;
}

export const PostManager: React.FC<PostManagerProps> = ({
  initialPosts = [],
  onPostScheduled,
  onPostPublished
}) => {
  // State management
  const [activePost, setActivePost] = useState<Post | null>(() => initialPosts[0] || null);
  const [content, setContent] = useState(() => activePost?.content || '');
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [analytics, setAnalytics] = useState<Map<string, PostAnalytics>>(new Map());
  const [isPublishing, setIsPublishing] = useState(false);

  // Custom hooks
  const { saveDraft, getDraft, getAllDrafts, draftsCount } = useAutoDraft({
    debounceMs: 1000,
    maxDrafts: 10
  });

  const {
    scheduledPosts,
    isTimeSlotAvailable,
    getNextAvailableSlot,
    schedulePost,
    unschedulePost,
    getConflictingPosts
  } = usePostScheduler({
    timeSlots: generateTimeSlots(),
    blackoutPeriods: [],
    maxPostsPerDay: 5
  });

  // Initialize analytics for published posts
  useEffect(() => {
    if (activePost?.status === 'published') {
      setAnalytics(prev => {
        const newAnalytics = new Map(prev);
        if (!prev.has(activePost.id)) {
          newAnalytics.set(activePost.id, {
            views: 0,
            likes: 0,
            shares: 0,
            engagement: 0
          });
        }
        return newAnalytics;
      });
    }
  }, [activePost]);

  // Memoized values
  const sortedDrafts = useMemo(() => getAllDrafts(), [getAllDrafts]);
  
  const postAnalytics = useMemo(() => {
    if (!activePost) return null;
    return analytics.get(activePost.id);
  }, [activePost, analytics]);

  const isValidPost = useMemo(() => {
    return content.length > 0 && content.length <= 280 && // Twitter-like limit
           images.every(img => img.status === 'complete');
  }, [content, images]);

  // Effects
  useEffect(() => {
    if (activePost && content) {
      saveDraft(activePost.id, content, images.map(img => img.preview));
    }
  }, [activePost, content, images, saveDraft]);

  useEffect(() => {
    // Simulate analytics updates
    const interval = setInterval(() => {
      if (activePost && activePost.status === 'published') {
        setAnalytics(prev => {
          const newAnalytics = new Map(prev);
          const current = prev.get(activePost.id) || {
            views: 0,
            likes: 0,
            shares: 0,
            engagement: 0
          };
          
          newAnalytics.set(activePost.id, {
            ...current,
            views: current.views + Math.floor(Math.random() * 10),
            likes: current.likes + Math.floor(Math.random() * 3),
            shares: current.shares + Math.floor(Math.random() * 2),
            engagement: Math.random()
          });
          
          return newAnalytics;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activePost]);

  // Callbacks
  const handleImageUpload = useCallback(async (files: FileList) => {
    const newImages: ImageUpload[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }));

    setImages(prev => [...prev, ...newImages]);

    // Simulate upload progress
    newImages.forEach((image, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setImages(prev => 
            prev.map((img, i) => 
              i === index + prev.length - newImages.length
                ? { ...img, progress }
                : img
            )
          );
        }
        if (progress === 100) {
          clearInterval(interval);
          setImages(prev =>
            prev.map((img, i) =>
              i === index + prev.length - newImages.length
                ? { ...img, status: 'complete' }
                : img
            )
          );
        }
      }, 500);
    });
  }, []);

  const handleSchedule = useCallback(async () => {
    if (!activePost || !isValidPost) return;

    const nextSlot = getNextAvailableSlot();
    if (!nextSlot) {
      console.error('No available time slots');
      return;
    }

    const scheduled = schedulePost(
      {
        ...activePost,
        content,
        images: images.map(img => img.preview)
      },
      nextSlot
    );

    if (scheduled) {
      onPostScheduled?.({
        ...activePost,
        content,
        status: 'scheduled'
      });
      setActivePost(null);
      setContent('');
      setImages([]);
    }
  }, [activePost, content, images, isValidPost, getNextAvailableSlot, schedulePost, onPostScheduled]);

  const handlePublish = useCallback(async () => {
    if (!activePost || !isValidPost || isPublishing) return;

    setIsPublishing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const publishedPost: Post = {
        ...activePost,
        content,
        images: images.map(img => img.preview),
        status: 'published'
      };

      onPostPublished?.(publishedPost);
      setActivePost(null);
      setContent('');
      setImages([]);
    } finally {
      setIsPublishing(false);
    }
  }, [activePost, content, images, isValidPost, isPublishing, onPostPublished]);

  return (
    <div className="post-manager">
      <div className="post-editor">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={280}
        />
        <div className="character-count">
          {content.length}/280
        </div>
        
        <div className="image-upload">
          <input
            type="file"
            multiple
            accept="image/*"
            id="image-upload"
            onChange={e => e.target.files && handleImageUpload(e.target.files)}
          />
          <label htmlFor="image-upload">Upload Image</label>
          <div className="image-previews">
            {images.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={img.preview} alt={`Upload ${index + 1}`} />
                {img.status === 'uploading' && (
                  <div className="progress-bar" data-testid="progress-bar">
                    <div 
                      className="progress"
                      style={{ width: `${img.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="actions">
          <button
            onClick={handleSchedule}
            disabled={!isValidPost || !activePost}
          >
            Schedule
          </button>
          <button
            onClick={handlePublish}
            disabled={!isValidPost || !activePost || isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>

      <div className="drafts-panel">
        <h3>Drafts ({draftsCount})</h3>
        <div className="drafts-list">
          {sortedDrafts.map((draft, index) => (
            <div
              key={index}
              className="draft-item"
              onClick={() => {
                setContent(draft.content);
                setImages(
                  draft.images.map(preview => ({
                    file: new File([], 'image'),
                    preview,
                    status: 'complete',
                    progress: 100
                  }))
                );
              }}
            >
              <p>{draft.content.substring(0, 50)}...</p>
              <span>Last saved: {draft.lastSaved.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {activePost && postAnalytics && (
        <div className="analytics-panel">
          <h3>Analytics</h3>
          <div className="analytics-grid">
            <div className="metric">
              <label>Views</label>
              <span>{postAnalytics.views}</span>
            </div>
            <div className="metric">
              <label>Likes</label>
              <span>{postAnalytics.likes}</span>
            </div>
            <div className="metric">
              <label>Shares</label>
              <span>{postAnalytics.shares}</span>
            </div>
            <div className="metric">
              <label>Engagement</label>
              <span>{(postAnalytics.engagement * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function to generate time slots
function generateTimeSlots(): Date[] {
  const slots: Date[] = [];
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  for (let i = 0; i < 24 * 7; i++) { // Next 7 days
    const slot = new Date(now.getTime());
    slot.setHours(slot.getHours() + i);
    slots.push(slot);
  }

  return slots;
}
