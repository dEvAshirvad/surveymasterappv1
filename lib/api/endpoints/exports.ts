import { apiClient } from '@/lib/api/client';
import type { ApiRequestConfig } from '@/lib/api/client';

function parseFilename(disposition?: string | null) {
  if (!disposition)
    return null;
  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? null;
}

async function downloadFile(
  path: string,
  fallbackName: string,
): Promise<{ blob: Blob; fileName: string }> {
  const requestConfig: ApiRequestConfig = {
    responseType: 'blob',
    skipEnvelope: true,
  };
  const response = await apiClient.get<Blob>(path, {
    ...requestConfig,
  });

  return {
    blob: response.data as Blob,
    fileName: parseFilename(response.headers['content-disposition']) ?? fallbackName,
  };
}

export async function downloadSessionArchive(sessionId: string) {
  return downloadFile(
    `/api/v1/exports/sessions/${sessionId}/archive.zip`,
    `session-${sessionId}-all-forms.zip`,
  );
}

export async function downloadSessionFormPdf(sessionId: string, formCode: string) {
  return downloadFile(
    `/api/v1/exports/sessions/${sessionId}/forms/${formCode.toUpperCase()}.pdf`,
    `session-${sessionId}-form-${formCode.toUpperCase()}.pdf`,
  );
}

export async function downloadSessionFormCsv(sessionId: string, formCode: string) {
  return downloadFile(
    `/api/v1/exports/sessions/${sessionId}/forms/${formCode.toUpperCase()}.csv`,
    `session-${sessionId}-form-${formCode.toUpperCase()}.csv`,
  );
}

export async function downloadSessionFormXlsx(sessionId: string, formCode: string) {
  return downloadFile(
    `/api/v1/exports/sessions/${sessionId}/forms/${formCode.toUpperCase()}.xlsx`,
    `session-${sessionId}-form-${formCode.toUpperCase()}.xlsx`,
  );
}
