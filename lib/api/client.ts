import axios, { type AxiosRequestConfig } from "axios";

import { ApiError, type ApiEnvelope } from "@/lib/api/envelope";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ApiRequestConfig = AxiosRequestConfig & {
  skipEnvelope?: boolean;
};

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    const config = response.config as ApiRequestConfig;

    if (config.skipEnvelope || response.data == null) {
      return response;
    }

    const envelope = response.data as ApiEnvelope;

    if (envelope.success === false) {
      throw new ApiError(
        envelope.status ?? response.status,
        envelope.error?.code ?? "UNKNOWN_ERROR",
        envelope.error?.message ?? "Request failed",
        envelope.error,
      );
    }

    response.data = envelope.data;
    return response;
  },
  (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.response?.data) {
      throw error;
    }

    const envelope = error.response.data as ApiEnvelope;

    if (envelope.success === false && envelope.error) {
      throw new ApiError(
        error.response.status,
        envelope.error.code,
        envelope.error.message,
        envelope.error,
      );
    }

    throw error;
  },
);

export async function apiGet<T>(
  url: string,
  config?: ApiRequestConfig,
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: ApiRequestConfig,
): Promise<T> {
  const response = await apiClient.post<T>(url, body, config);
  return response.data;
}

export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: ApiRequestConfig,
): Promise<T> {
  const response = await apiClient.patch<T>(url, body, config);
  return response.data;
}

export async function apiDelete<T>(
  url: string,
  config?: ApiRequestConfig,
): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}
