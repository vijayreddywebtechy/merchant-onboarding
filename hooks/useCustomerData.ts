import { useEffect, useState } from "react";

interface CustomerData {
  [key: string]: any;
}

export const useCustomerData = (): CustomerData | null => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("customerData");
      if (storedData) {
        const parsedData = JSON.parse(storedData) as CustomerData;
        setCustomerData(parsedData);
      }
    } catch (error) {
      console.error("Failed to parse customer data:", error);
      setCustomerData(null);
    }
  }, []);

  return customerData;
};
