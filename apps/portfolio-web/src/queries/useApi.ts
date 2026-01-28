import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiError {
  message: string;
  status?: number;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const useApi = async <T = any>(
  method: HttpMethod = 'GET',
  path: string,
  data?: any,
  params?: any
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.request({
      method,
      url: path,
      data,
      params,
    });
    return response.data; // Return data strongly typed
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data.message || "An error occurred",
        status: error.response?.status,
      };
      throw apiError; // Throw custom API error
    }
    throw { message: "An error occurred", status: 500 } as ApiError; // Default error
  }
};

export default useApi;
export type { ApiError, HttpMethod };