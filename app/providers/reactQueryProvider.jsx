"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const ReactQueryProvider = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
