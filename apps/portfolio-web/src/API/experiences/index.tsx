import { useQuery } from '@tanstack/react-query';
import { Experience } from './../../constants/index';
import useApi from '../useAPI';

export interface ExperiencesResponse {
    experiences: Experience[];
}

export const useGetExperiences = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ['experiences'],
        queryFn: async (): Promise<Experience[]> => {
            try {
                const response = await useApi<ExperiencesResponse>('GET', '/api/experience/experiences');
                return response.experiences;
            } catch (error) {
                console.warn('API fetch failed:', error);
                return [];
            }
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
