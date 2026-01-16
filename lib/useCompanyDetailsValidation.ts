import { useCallback } from "react";
import { hasIdValidationError, extractValidationErrors } from "./apiTransformers";

/**
 * Hook to handle company details API responses and validation errors
 */
export function useCompanyDetailsValidation() {
  const handleApiResponse = useCallback(
    (response: any, ownership: string) => {
      // Check for ID validation errors
      if (hasIdValidationError(response)) {
        const errors = extractValidationErrors(response);
        const idError = errors.find(
          (e) => e.id === "ZEVS_ID" || e.message.toLowerCase().includes("id number")
        );

        if (idError) {
          console.error("❌ ID Validation Error:", idError.message);

          // Suggest fix based on ownership type
          if (ownership === "sole-proprietor") {
            console.log(
              "ℹ️ For sole proprietors, use the director's personal ID number."
            );
          } else {
            console.log(
              `ℹ️ For ${ownership} entities, please provide a valid company registration number (not personal ID).`
            );
            console.log(
              "💡 Make sure the registrationNumber field in companyDetailsFormData contains the company's registration number, not a personal ID."
            );
          }

          return {
            success: false,
            error: idError.message,
            requiresCompanyRegistration: ownership !== "sole-proprietor",
          };
        }
      }

      return { success: true };
    },
    []
  );

  const getFieldErrorMessage = useCallback(
    (ownership: string): string | null => {
      if (ownership === "sole-proprietor") {
        return null; // No special message needed for sole proprietors
      }

      return `Company registration number required for ${ownership} entity`;
    },
    []
  );

  return {
    handleApiResponse,
    getFieldErrorMessage,
    hasIdValidationError,
    extractValidationErrors,
  };
}
