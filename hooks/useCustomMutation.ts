import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface CustomMutationOptions {
  url: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE" | "GET";
  config?: Record<string, any>;
}

interface MutationPayload {
  body: any;
  headers?: Record<string, string>;
}

interface MutationResponse {
  data: any;
  status?: number;
}

export const useCustomMutation = (
  options: CustomMutationOptions,
  mutationOptions?: Omit<UseMutationOptions<any, AxiosError, MutationPayload>, "mutationFn">
) => {
  const { url, method = "POST", config = {} } = options;

  return useMutation({
    mutationFn: async ({ body, headers = {} }: MutationPayload) => {
      const token = sessionStorage.getItem("ping_access_token_data");
      const accessToken = token ? JSON.parse(token).access_token : null;

      const response = await axios({
        url,
        method,
        data: body,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...headers,
        },
        ...config,
      });

      return response.data;
    },
    ...mutationOptions,
  });
};
