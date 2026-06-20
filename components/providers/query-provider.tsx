"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useMemo, useState } from "react";

import { flushSyncOutbox } from "@/lib/sync/sync-engine";
import { subscribeConnectivity } from "@/lib/sync/connectivity";

type QueryProviderProps = {
	children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000,
						refetchOnWindowFocus: false,
						refetchOnReconnect: true,
						retry: (failureCount, error) => {
							if (typeof navigator !== "undefined" && !navigator.onLine) {
								return false;
							}
							const status = (error as { status?: number } | null)?.status;
							if (status && status >= 400 && status < 500) {
								return false;
							}
							return failureCount < 2;
						},
					},
					mutations: {
						retry: false,
					},
				},
			}),
	);

	const persister = useMemo(() => {
		if (typeof window === "undefined") return undefined;
		return createSyncStoragePersister({
			storage: window.localStorage,
			key: "surveymaster-query-cache-v1",
			throttleTime: 2000,
		});
	}, []);

	useEffect(() => {
		const unsubscribe = subscribeConnectivity(() => {
			void flushSyncOutbox();
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		void flushSyncOutbox();
	}, []);

	if (!persister) {
		return (
			<QueryClientProvider client={queryClient}>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		);
	}

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister,
				maxAge: 24 * 60 * 60 * 1000,
				dehydrateOptions: {
					shouldDehydrateQuery: (query) =>
						query.state.status === "success"
						&& !String(query.queryKey[0] ?? "").startsWith("admin"),
				},
			}}
		>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</PersistQueryClientProvider>
	);
}
