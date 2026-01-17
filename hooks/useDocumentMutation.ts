import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface DocumentMutationOptions {
  url: string;
}

interface MutationPayload {
  body: any;
  headers?: Record<string, string>;
}

export const useDocumentMutation = (
  options: DocumentMutationOptions,
  mutationOptions?: Omit<UseMutationOptions<Blob, AxiosError, MutationPayload>, "mutationFn">
) => {
  const { url } = options;

  return useMutation({
    mutationFn: async ({ body, headers = {} }: MutationPayload) => {
      const token = sessionStorage.getItem("ping_access_token_data");
      const accessToken = token ? JSON.parse(token).access_token : null;

      const response = await axios({
        url,
        method: "POST",
        data: body,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...headers,
        },
        responseType: "blob", // Important for PDF/document downloads
      });

      return response.data;
    },
    ...mutationOptions,
  });
};
