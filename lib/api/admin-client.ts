import axios, { type AxiosRequestConfig } from "axios";

import { ApiError, type ApiEnvelope } from "@/lib/api/envelope";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const internalToken = process.env.NEXT_PUBLIC_INTERNAL_API_TOKEN?.trim();

export type AdminRequestConfig = AxiosRequestConfig & {
  skipEnvelope?: boolean;
};

export const adminApiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    ...(internalToken ? { "x-internal-token": internalToken } : {}),
  },
});

adminApiClient.interceptors.response.use(
  (response) => {
    const config = response.config as AdminRequestConfig;

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

export async function adminGet<T>(
  url: string,
  config?: AdminRequestConfig,
): Promise<T> {
  const response = await adminApiClient.get<T>(url, config);
  return response.data;
}
