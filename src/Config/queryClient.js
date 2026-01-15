import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for this duration
            gcTime: 30 * 60 * 1000, // 30 minutes - unused data stays in cache (formerly cacheTime)
            retry: 1, // Only retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnReconnect: true, // Refetch when network reconnects
        },
        mutations: {
            retry: 0, // Don't retry failed mutations
        },
    },
});
