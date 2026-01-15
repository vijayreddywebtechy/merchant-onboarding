import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface AccessTokenData {
  access_token: string;
  expires_in: number;
  timestamp: number;
}

export const useAccessToken = (
  mutationOptions?: Omit<UseMutationOptions<AccessTokenResponse, AxiosError, void>, "mutationFn">
) => {
  return useMutation({
    mutationFn: async () => {
      // Call our backend API endpoint which handles token generation
      const response = await axios.post("/api/token");

      const data = response.data as AccessTokenResponse;

      if (data?.access_token) {
        localStorage.setItem("accessToken", data.access_token);

        // Save token with timestamp and expiry for refresh tracking
        if (data?.expires_in) {
          const tokenData: AccessTokenData = {
            access_token: data.access_token,
            expires_in: data.expires_in,
            timestamp: Date.now(),
          };
          sessionStorage.setItem("ping_access_token_data", JSON.stringify(tokenData));
        }
      }

      return data;
    },
    ...mutationOptions,
  });
};
