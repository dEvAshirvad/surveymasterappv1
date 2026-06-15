export type ApiErrorBody = {
  code: string;
  title: string;
  message: string;
  errors?: Record<string, unknown>;
};

export type ApiPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiEnvelope<T = unknown> = {
  success: boolean;
  status: number;
  timestamp: string;
  cache: boolean;
  data?: T;
  error?: ApiErrorBody;
  requestId?: string;
  pagination?: ApiPagination;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly body?: ApiErrorBody;

  constructor(
    status: number,
    code: string,
    message: string,
    body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}
