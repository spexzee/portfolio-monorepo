import { useQuery } from '@tanstack/react-query';
import { Project } from './../../constants/index';
import { projects as fallbackProjects } from '../../constants';
import useApi from '../useAPI';

export interface ProjectsResponse {
  projects: Project[];
}

export const useGetProjects = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      try {
        // Try to fetch from API first
        const response = await useApi<ProjectsResponse>('GET', '/api/project/projects');
        return response.projects;
      } catch (error) {
        // If API fails, return fallback projects from constants
        console.warn('API fetch failed, using fallback projects:', error);
        return fallbackProjects;
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