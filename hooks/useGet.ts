import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

interface UseGetOptions extends Omit<UseQueryOptions, "queryKey" | "queryFn"> {
  enabled?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export const useGet = (
  key: string,
  url: string,
  options: UseGetOptions = {}
) => {
  const { enabled = true, headers = {}, params = {}, ...queryOptions } = options;

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");
    const uuid = uuidv4();

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${url}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID || "",
          "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || "",
          "x-fapi-interaction-id": uuid,
          "x-sbg-channel": process.env.NEXT_PUBLIC_SBG_CHANNEL_NAME || "",
          ...headers,
        },
        params,
      }
    );

    return response.data;
  };

  return useQuery({
    queryKey: [key, params],
    queryFn: fetchData,
    enabled,
    retry: false,
    ...queryOptions,
  });
};
