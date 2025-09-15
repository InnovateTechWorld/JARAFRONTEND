import { useState, useEffect } from 'react';
import { api, Creator } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useCreator() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCreator();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchCreator = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get current user's creator profile
      const response = await api.getCurrentCreator();
      setCreator(response.creator);
      // Store the creator ID in localStorage for future use
      localStorage.setItem(`creator_${user!.id}`, response.creator.id);
    } catch (error: any) {
      console.error('Error fetching creator:', error);
      // If creator doesn't exist (404), clear localStorage and set creator to null
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        localStorage.removeItem(`creator_${user!.id}`);
        setCreator(null);
        setError(null); // Not an error, just doesn't exist
      } else {
        setError(error instanceof Error ? error.message : 'Failed to fetch creator');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createCreator = async (creatorData: Partial<Creator>) => {
    try {
      const response = await api.createCreator(creatorData);
      // Store the creator ID in localStorage for future use
      localStorage.setItem(`creator_${user!.id}`, response.creator.id);
      setCreator(response.creator);
      return response.creator;
    } catch (error: any) {
      console.error('Error creating creator:', error);

      // If the error suggests using PUT instead, try to get the existing profile and update it
      if (error.message?.includes('Use PUT')) {
        try {
          // Get the existing creator profile
          const existingProfile = await api.getCurrentCreator();
          // Update it with the provided data
          const updateResponse = await api.updateCreator(existingProfile.creator.id, creatorData);
          localStorage.setItem(`creator_${user!.id}`, updateResponse.creator.id);
          setCreator(updateResponse.creator);
          return updateResponse.creator;
        } catch (updateError) {
          console.error('Error updating existing creator:', updateError);
          throw updateError;
        }
      }

      throw error;
    }
  };

  const updateCreator = async (updates: Partial<Creator>) => {
    if (!creator) return;

    try {
      const response = await api.updateCreator(creator.id, updates);
      setCreator(response.creator);
      return response.creator;
    } catch (error) {
      console.error('Error updating creator:', error);
      throw error;
    }
  };

  return {
    creator,
    isLoading,
    error,
    createCreator,
    updateCreator,
    refetch: fetchCreator,
  };
}