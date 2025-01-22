import { useState, useCallback, useMemo } from 'react';
import { Post, PostScheduleConfig } from '../types/post.types';

export const usePostScheduler = (config: PostScheduleConfig) => {
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);

  const isTimeSlotAvailable = useCallback((time: Date): boolean => {
    // Check if time is within blackout periods
    const isBlackout = config.blackoutPeriods.some(
      period => time >= period.start && time <= period.end
    );
    if (isBlackout) return false;

    // Check if time is in allowed slots
    const isAllowedSlot = config.timeSlots.some(
      slot => slot.getTime() === time.getTime()
    );
    if (!isAllowedSlot) return false;

    // Check posts per day limit
    const postsOnSameDay = scheduledPosts.filter(post => {
      const postDate = post.scheduledTime!;
      return (
        postDate.getFullYear() === time.getFullYear() &&
        postDate.getMonth() === time.getMonth() &&
        postDate.getDate() === time.getDate()
      );
    });

    return postsOnSameDay.length < config.maxPostsPerDay;
  }, [config, scheduledPosts]);

  const getNextAvailableSlot = useCallback((): Date | null => {
    const sortedSlots = [...config.timeSlots].sort((a, b) => a.getTime() - b.getTime());
    return sortedSlots.find(slot => isTimeSlotAvailable(slot)) || null;
  }, [config.timeSlots, isTimeSlotAvailable]);

  const scheduledSlots = useMemo(() => {
    return scheduledPosts.reduce((acc, post) => {
      if (post.scheduledTime) {
        acc.set(post.scheduledTime.getTime(), post);
      }
      return acc;
    }, new Map<number, Post>());
  }, [scheduledPosts]);

  const schedulePost = useCallback((post: Omit<Post, 'scheduledTime'>, time: Date): boolean => {
    if (!isTimeSlotAvailable(time)) return false;

    const newPost: Post = {
      ...post,
      scheduledTime: time,
      status: 'scheduled'
    };

    setScheduledPosts(prev => [...prev, newPost]);
    return true;
  }, [isTimeSlotAvailable]);

  const unschedulePost = useCallback((postId: string) => {
    setScheduledPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, scheduledTime: undefined, status: 'draft' }
          : post
      )
    );
  }, []);

  const getConflictingPosts = useCallback((time: Date): Post[] => {
    return scheduledPosts.filter(post => 
      post.scheduledTime && 
      Math.abs(post.scheduledTime.getTime() - time.getTime()) < 3600000 // within 1 hour
    );
  }, [scheduledPosts]);

  return {
    scheduledPosts,
    isTimeSlotAvailable,
    getNextAvailableSlot,
    schedulePost,
    unschedulePost,
    getConflictingPosts,
    scheduledSlots
  };
};
