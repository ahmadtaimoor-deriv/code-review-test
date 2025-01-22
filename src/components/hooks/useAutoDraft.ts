import { useState, useEffect, useCallback, useRef } from 'react';
import { DraftAutoSave } from '../types/post.types';

interface AutoDraftConfig {
  debounceMs: number;
  maxDrafts: number;
}

export const useAutoDraft = (config: AutoDraftConfig) => {
  const [drafts, setDrafts] = useState<Map<string, DraftAutoSave>>(new Map());
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSave = useCallback((draftId: string, content: string, images: string[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setDrafts(prevDrafts => {
        const newDrafts = new Map(prevDrafts);
        newDrafts.set(draftId, {
          content,
          images,
          lastSaved: new Date()
        });

        // Remove oldest drafts if exceeding maxDrafts
        if (newDrafts.size > config.maxDrafts) {
          const sortedDrafts = Array.from(newDrafts.entries())
            .sort(([, a], [, b]) => b.lastSaved.getTime() - a.lastSaved.getTime());
          
          while (sortedDrafts.length > config.maxDrafts) {
            const [oldestId] = sortedDrafts.pop()!;
            newDrafts.delete(oldestId);
          }
        }

        return newDrafts;
      });
    }, config.debounceMs);
  }, [config.debounceMs, config.maxDrafts]);

  const saveDraft = useCallback((draftId: string, content: string, images: string[]) => {
    setCurrentDraftId(draftId);
    debouncedSave(draftId, content, images);
  }, [debouncedSave]);

  const getDraft = useCallback((draftId: string): DraftAutoSave | undefined => {
    return drafts.get(draftId);
  }, [drafts]);

  const deleteDraft = useCallback((draftId: string) => {
    setDrafts(prevDrafts => {
      const newDrafts = new Map(prevDrafts);
      newDrafts.delete(draftId);
      return newDrafts;
    });

    if (currentDraftId === draftId) {
      setCurrentDraftId(null);
    }
  }, [currentDraftId]);

  const getAllDrafts = useCallback((): DraftAutoSave[] => {
    return Array.from(drafts.values())
      .sort((a, b) => b.lastSaved.getTime() - a.lastSaved.getTime());
  }, [drafts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveDraft,
    getDraft,
    deleteDraft,
    getAllDrafts,
    currentDraftId,
    draftsCount: drafts.size
  };
};
