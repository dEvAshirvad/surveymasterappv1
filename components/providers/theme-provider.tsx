"use client";

import type { PropsWithChildren } from "react";

type ThemeProviderProps = PropsWithChildren;

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>;
}
