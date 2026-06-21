"use client";

import { useMutation } from "@tanstack/react-query";

import {
  downloadSessionArchive,
  downloadSessionFormCsv,
  downloadSessionFormPdf,
  downloadSessionFormXlsx,
} from "@/lib/api/endpoints/exports";

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function useDownloadSessionArchive() {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const result = await downloadSessionArchive(sessionId);
      saveBlob(result.blob, result.fileName);
      return result;
    },
  });
}

export function useDownloadSessionFormPdf() {
  return useMutation({
    mutationFn: async ({ sessionId, formCode }: { sessionId: string; formCode: string }) => {
      const result = await downloadSessionFormPdf(sessionId, formCode);
      saveBlob(result.blob, result.fileName);
      return result;
    },
  });
}

export function useDownloadSessionFormCsv() {
  return useMutation({
    mutationFn: async ({ sessionId, formCode }: { sessionId: string; formCode: string }) => {
      const result = await downloadSessionFormCsv(sessionId, formCode);
      saveBlob(result.blob, result.fileName);
      return result;
    },
  });
}

export function useDownloadSessionFormXlsx() {
  return useMutation({
    mutationFn: async ({ sessionId, formCode }: { sessionId: string; formCode: string }) => {
      const result = await downloadSessionFormXlsx(sessionId, formCode);
      saveBlob(result.blob, result.fileName);
      return result;
    },
  });
}
