import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface FormWatchResult {
  isValid: boolean;
  errors: string[];
  formData: Record<string, any>;
}

export const useFormWatch = (): FormWatchResult => {
  const {
    watch,
    formState: { errors, isValid },
  } = useFormContext();

  const allFormData = watch();

  useEffect(() => {
    const result = {
      isValid,
      errors: Object.keys(errors),
      formData: allFormData,
    };

    console.log("📋 Form Validation State:", result);

    // You can also emit this to a global state/event emitter if needed
    // dispatch(updateFormState(result));
  }, [isValid, errors, allFormData]);

  return {
    isValid,
    errors: Object.keys(errors),
    formData: allFormData,
  };
};
