import { useState } from "react";

export const useCompanyData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async (nidNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("ping_access_token_data");
      const accessToken = token ? JSON.parse(token).access_token : null;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`/api/get-customers?nidNumber=${nidNumber}`, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch customers");
      }

      // Store in localStorage
      const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
      storedData.customersData = data;
      storedData.customersDataTimestamp = Date.now();
      localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyDirectors = async (idNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("ping_access_token_data");
      const accessToken = token ? JSON.parse(token).access_token : null;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `/api/get-company-directors?idNumber=${encodeURIComponent(idNumber)}`,
        { headers }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch company directors");
      }

      // Store in localStorage
      const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
      storedData.companyDirectors = data;
      storedData.companyDirectorsTimestamp = Date.now();
      localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch company directors");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyInfo = async (idNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("ping_access_token_data");
      const accessToken = token ? JSON.parse(token).access_token : null;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `/api/get-company-info?idNumber=${encodeURIComponent(idNumber)}`,
        { headers }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch company information");
      }

      // Store in localStorage
      const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
      storedData.companyInfo = data;
      storedData.companyInfoTimestamp = Date.now();
      localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch company information");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyDetails = async (idNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [directorsData, companyInfoData] = await Promise.all([
        fetchCompanyDirectors(idNumber),
        fetchCompanyInfo(idNumber),
      ]);

      return {
        directors: directorsData,
        companyInfo: companyInfoData,
      };
    } catch (err: any) {
      setError(err.message || "Failed to fetch company details");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchCustomers,
    fetchCompanyDirectors,
    fetchCompanyInfo,
    fetchCompanyDetails,
    isLoading,
    error,
  };
};
