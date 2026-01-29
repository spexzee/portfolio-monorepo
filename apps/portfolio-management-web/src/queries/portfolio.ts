import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Types
export interface Technology {
    _id?: string;
    name: string;
    icon: string;
}

export interface ProjectTech {
    name: string;
    color: string;
}

export interface Project {
    _id?: string;
    name: string;
    description: string;
    technologies: ProjectTech[];
    image: string;
    source_code_link?: string;
    demo_link: string;
    category: 'frontend' | 'fullstack' | 'tools';
}

export interface Experience {
    _id?: string;
    title: string;
    company_name: string;
    icon: string;
    iconBg: string;
    date: string;
    points: string[];
}

// API Functions
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
}

// Technologies
export function useGetTechnologies() {
    return useQuery({
        queryKey: ['technologies'],
        queryFn: () => fetchApi<{ technologies: Technology[] }>('/api/tech/technologies'),
        select: (data) => data.technologies,
    });
}

export function useCreateTechnology() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Technology, '_id'>) =>
            fetchApi('/api/tech/technologies', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['technologies'] }),
    });
}

export function useUpdateTechnology() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Technology> }) =>
            fetchApi(`/api/tech/technologies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['technologies'] }),
    });
}

export function useDeleteTechnology() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            fetchApi(`/api/tech/technologies/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['technologies'] }),
    });
}

// Projects
export function useGetProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: () => fetchApi<{ projects: Project[] }>('/api/project/projects'),
        select: (data) => data.projects,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Project, '_id'>) =>
            fetchApi('/api/project/projects', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
            fetchApi(`/api/project/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            fetchApi(`/api/project/projects/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });
}

// Experiences
export function useGetExperiences() {
    return useQuery({
        queryKey: ['experiences'],
        queryFn: () => fetchApi<{ experiences: Experience[] }>('/api/experience/experiences'),
        select: (data) => data.experiences,
    });
}

export function useCreateExperience() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Experience, '_id'>) =>
            fetchApi('/api/experience/experiences', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
    });
}

export function useUpdateExperience() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) =>
            fetchApi(`/api/experience/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
    });
}

export function useDeleteExperience() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            fetchApi(`/api/experience/experiences/${id}`, { method: 'DELETE' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
    });
}
