export interface ApiEndpoint {
  name: string;
  path: string; // The relative path in our Next.js app (e.g., /api/get-customers)
  method: string;
  targetUrl: string; // The real backend URL it proxies to
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    name: "Get Customers",
    path: "/api/get-customers",
    method: "GET",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/external-partners/customers`,
  },
  {
    name: "Retrieve Company Information",
    path: "/api/retrieve-company-information",
    method: "GET",
    targetUrl: `${process.env.NEXT_PUBLIC_PREAPPLICATION_URL}npextorg/extnonprod/retrieve-company-information/company-id`,
  },
  {
    name: "Pre-Application",
    path: "/api/pre-application",
    method: "POST",
    targetUrl: `${process.env.NEXT_PUBLIC_PREAPPLICATION_URL}npextorg/extnonprod/business-lending-mymobiz/pre-application`,
  },
  {
    name: "Send OTP",
    path: "/api/send-otp",
    method: "POST",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/unsecured-lending/otp`,
  },
  {
    name: "Verify OTP",
    path: "/api/verify-otp",
    method: "POST",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/unsecured-lending/otp`,
  },
  {
    name: "Company Details Update",
    path: "/api/company-details",
    method: "PUT",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/company-details-for-ao/company`,
  },
  {
    name: "Retrieve Related Parties",
    path: "/api/related-parties",
    method: "GET",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/related-parties/retrieve-party`,
  },
  {
    name: "Update Related Parties",
    path: "/api/related-parties-update",
    method: "PUT",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/related-party-details-for-ao/manage-party`,
  },
  {
    name: "Get Pay Account",
    path: "/api/get-pay-account",
    method: "GET",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/nominated/partners/{partnerGuid}/pay-account`,
  },
  {
    name: "Verify Account",
    path: "/api/verify-account",
    method: "POST",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/account-verification/verify`,
  },
  {
    name: "Set Digital Offer",
    path: "/api/set-digital-offer",
    method: "PUT",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/digital-offer-mymobiz/offer/{offerId}`,
  },
  {
    name: "Create Contract",
    path: "/api/create-contract",
    method: "POST",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/application/offer/{offerId}/contract`,
  },
  {
    name: "Retrieve Document",
    path: "/api/retrieve-document",
    method: "POST",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/retrieve/documents`,
  },
  {
    name: "OTP Token",
    path: "/api/otp-token",
    method: "POST",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/sysauth/oauth2/token`,
  },
  {
    name: "iIdentifii Init",
    path: "/api/iidentifii-init",
    method: "POST",
    targetUrl: "https://alphawebapi.iidentifii.com/init",
  },
  {
    name: "Get Company Directors",
    path: "/api/get-company-directors",
    method: "GET",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/retrieve-company-information/company-id`,
  },
  {
    name: "Get Company Info",
    path: "/api/get-company-info",
    method: "GET",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/retrieve-company-information/company-id`,
  },
  {
    name: "Get Customer Details",
    path: "/api/get-customer-details/[uuid]",
    method: "GET",
    targetUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/external-partners/customers/{uuid}`,
  },
];
