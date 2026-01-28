import { useQuery } from '@tanstack/react-query';
import { Technology } from './../../constants/index';
import { technologies as fallbackTechnologies } from '../../constants';
import useApi from '../useAPI';

export interface TechnologiesResponse {
  technologies: Technology[];
}

export const useGetTechnologies = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: async (): Promise<Technology[]> => {
      try {
        // Try to fetch from API first
        const response = await useApi<TechnologiesResponse>('GET', '/api/tech/technologies');
        return response.technologies;
      } catch (error) {
        // If API fails, return fallback technologies from constants
        console.warn('API fetch failed, using fallback technologies:', error);
        return fallbackTechnologies;
      }
    },
    // Only fetch when enabled is true
    enabled,
    // Set a reasonable stale time to avoid too frequent refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Always return fallback data even if query fails
    retry: 1,
  });
};