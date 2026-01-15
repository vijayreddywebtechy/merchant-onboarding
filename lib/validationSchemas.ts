import * as yup from "yup";

// Company Details Schema
export const companyDetailsSchema = yup.object<CompanyDetailsSchema>().shape({
  registeredCompanyName: yup
    .string()
    .trim()
    .required("Registered business name is required"),
  countryOfRegistration: yup.string().required("Country is required"),
  addressType: yup
    .string()
    .oneOf(["same", "different"])
    .required("Please select an address type") as yup.Schema<"same" | "different">,
  addressSearch: yup.string().trim() as yup.Schema<string | undefined>,
  streetNumber: yup
    .string()
    .trim()
    .when("addressType", {
      is: "different",
      then: (schema) =>
        schema.required("Street number and name are required"),
      otherwise: (schema) => schema.notRequired(),
    }) as any,
  suburb: yup.string().when("addressType", {
    is: "different",
    then: (schema) => schema.trim().required("Suburb is required"),
    otherwise: (schema) => schema.notRequired(),
  }) as any,
  complexName: yup.string().trim().nullable() as any,
  province: yup.string().when("addressType", {
    is: "different",
    then: (schema) => schema.required("Province is required"),
    otherwise: (schema) => schema.notRequired(),
  }) as any,
  cityTown: yup.string().when("addressType", {
    is: "different",
    then: (schema) => schema.required("City/town is required"),
    otherwise: (schema) => schema.notRequired(),
  }) as any,
  postalCode: yup.string().when("addressType", {
    is: "different",
    then: (schema) =>
      schema
        .trim()
        .required("Postal code is required")
        .matches(/^[0-9]{4,6}$/, "Enter a valid postal code"),
    otherwise: (schema) => schema.notRequired(),
  }) as any,
  natureOfBusiness: yup
    .string()
    .required("Nature of business is required"),
  industryClassification: yup
    .string()
    .required("Industry classification is required"),
  preferredBranch: yup.string().nullable() as any,
  ownership: yup.string().required("Ownership is required"),
  hasValidBBBEE: yup.string().required("Please select an option"),
});

interface CompanyDetailsSchema {
  registeredCompanyName: string;
  countryOfRegistration: string;
  addressType: "same" | "different";
  addressSearch?: string;
  streetNumber?: string;
  suburb?: string;
  complexName?: string | null;
  province?: string;
  cityTown?: string;
  postalCode?: string;
  natureOfBusiness: string;
  industryClassification: string;
  preferredBranch?: string | null;
  ownership: string;
  hasValidBBBEE: string;
}

// Company Financial Info Schema
export const companyFinancialInfoSchema = yup.object().shape({
  annualTurnover: yup
    .string()
    .required("Annual turnover is required"),
  monthlyProfit: yup
    .string()
    .required("Monthly profit is required"),
  averageTransactionAmount: yup
    .string()
    .required("Average transaction amount is required"),
  irregularIncome: yup
    .string()
    .required("Irregular income is required"),
  fundingSource: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one funding source")
    .required("Select at least one funding source"),
});

// Marketing Consent Schema
export const marketingConsentSchema = yup.object().shape({
  smsConsent: yup
    .string()
    .required("Please select SMS consent option"),
  emailConsent: yup
    .string()
    .required("Please select email consent option"),
  termsConsent: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

// Banking Details Schema
export const bankingDetailsSchema = yup.object().shape({
  estimatedTurnover: yup
    .string()
    .required("Estimated turnover is required"),
  bankName: yup.string().required("Bank name is required"),
  accountHolderName: yup
    .string()
    .trim()
    .required("Account holder name is required"),
  accountType: yup
    .string()
    .required("Account type is required"),
  accountNumber: yup
    .string()
    .trim()
    .required("Account number is required")
    .matches(/^[0-9]+$/, "Account number must contain only digits"),
  branchName: yup.string().required("Branch name is required"),
  branchCode: yup
    .string()
    .trim()
    .required("Branch code is required")
    .matches(/^[0-9]{6}$/, "Branch code must be 6 digits"),
});

// Delivery Details Schema
export const deliveryDetailsSchema = yup.object().shape({
  deliveryLocation: yup
    .string()
    .oneOf(["company", "residential", "new"])
    .required("Please select a delivery location"),
  contactPersonName: yup
    .string()
    .trim()
    .required("Contact person name is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),
  contactPersonSurname: yup
    .string()
    .trim()
    .required("Contact person surname is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),
  contactPersonNumber: yup
    .string()
    .trim()
    .required("Contact person number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  deliveryDate: yup
    .date()
    .required("Delivery date is required")
    .typeError("Please select a valid date"),
  addressSearch: yup.string().trim().when("deliveryLocation", {
    is: "new",
    then: (schema) => schema,
    otherwise: (schema) => schema.notRequired(),
  }),
  streetNumber: yup.string().when("deliveryLocation", {
    is: "new",
    then: (schema) =>
      schema.trim().required("Street number and name are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  suburb: yup.string().when("deliveryLocation", {
    is: "new",
    then: (schema) => schema.trim().required("Suburb is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  complexName: yup.string().trim().nullable(),
  province: yup.string().when("deliveryLocation", {
    is: "new",
    then: (schema) => schema.required("Province is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cityTown: yup.string().when("deliveryLocation", {
    is: "new",
    then: (schema) => schema.required("City/town is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  postalCode: yup.string().when("deliveryLocation", {
    is: "new",
    then: (schema) =>
      schema
        .trim()
        .required("Postal code is required")
        .matches(/^[0-9]{4,6}$/, "Enter a valid postal code"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Card Machine Summary Schema
export const cardMachineSummarySchema = yup.object().shape({
  cardMachineQuantity: yup
    .string()
    .required("Card machine quantity is required")
    .matches(/^[0-9]+$/, "Must be a valid number"),
  monthlyTransactionVolume: yup
    .string()
    .required("Monthly transaction volume is required"),
  acceptanceFee: yup.string().required("Acceptance fee is required"),
  agreementAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the agreement")
    .required("You must accept the agreement"),
});
