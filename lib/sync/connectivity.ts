"use client";

import { onlineManager } from "@tanstack/react-query";

export function isOnline() {
  if (typeof window === "undefined") return true;
  return navigator.onLine;
}

export function subscribeConnectivity(
  onReconnect: () => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleOnline = () => {
    onlineManager.setOnline(true);
    onReconnect();
  };
  const handleOffline = () => {
    onlineManager.setOnline(false);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}
