"use client";

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import type { DraftRecord, OutboxRecord } from "@/lib/storage/offline-types";

export interface OfflineDBSchema extends DBSchema {
  drafts: {
    key: string;
    value: DraftRecord;
    indexes: {
      "by-session": string;
      "by-session-form": string;
    };
  };
  outbox: {
    key: string;
    value: OutboxRecord;
    indexes: {
      "by-next-retry": number;
      "by-entry": string;
      "by-draft": string;
    };
  };
}

const DB_NAME = "surveymaster-offline";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<OfflineDBSchema>> | null = null;

function ensureDraftsStore(db: IDBPDatabase<OfflineDBSchema>) {
  if (db.objectStoreNames.contains("drafts")) return;
  const store = db.createObjectStore("drafts", { keyPath: "id" });
  store.createIndex("by-session", "sessionId");
  store.createIndex("by-session-form", "formCode");
}

function ensureOutboxStore(db: IDBPDatabase<OfflineDBSchema>) {
  if (db.objectStoreNames.contains("outbox")) return;
  const store = db.createObjectStore("outbox", { keyPath: "id" });
  store.createIndex("by-next-retry", "nextRetryAt");
  store.createIndex("by-entry", "entryId");
  store.createIndex("by-draft", "draftId");
}

export async function getOfflineDb() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!dbPromise) {
    dbPromise = openDB<OfflineDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        ensureDraftsStore(db);
        ensureOutboxStore(db);
      },
    });
  }

  return dbPromise;
}
