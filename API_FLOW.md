# Application API Flow Documentation

This document outlines the API calls made throughout the Merchant Onboarding application flow, mapped to each screen/step, including the real-time backend endpoints they proxy to.

**Base URLs**:
*   `https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod`: `https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod`
*   `NEXT_PUBLIC_PREAPPLICATION_URL`: `https://api-gatewaynp.standardbank.co.za/`

## 1. Landing / Auth
### Screen: `app/account-onboarding/page.tsx`
*   **API Endpoint**: `Token Generation (via useAccessToken)`
    *   **Method**: `POST`
    *   **Proxy Route**: `/api/token` (implied)
    *   **Real Target**: `https://enterprisestssit.standardbank.co.za/as/token.oauth2`
    *   **Purpose**: Generates an access token for subsequent API calls.

*   **API Endpoint**: `/api/get-customers?nidNumber={directorId}`
    *   **Method**: `GET`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/external-partners/customers?nidType={nidType}&nidNumber={nidNumber}...`
    *   **Purpose**: Retrieves a list of companies/customers linked to the provided Director ID.

*   **API Endpoint**: `/api/get-customer-details/{uuid}`
    *   **Method**: `GET`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/external-partners/customers/{uuid}`
    *   **Purpose**: Fetches detailed information for a specific customer UUID.

## 2. Identity Verification
### Screen: `components/VerifyIdentity/Instructions.tsx` / `VerifyBlock.tsx`
*   **API Endpoint**: `/api/iidentifii-init`
    *   **Method**: `POST`
    *   **Real Target**: `https://alphawebapi.iidentifii.com/init`
    *   **Purpose**: Initializes the iIdentifii identity verification session.

## 3. Company Selection
### Screen: `app/account-onboarding/your-companies/page.tsx`
*   **API Endpoint**: `/api/retrieve-company-information?idNumber={idNumber}`
    *   **Method**: `GET`
    *   **Real Target**: `${NEXT_PUBLIC_PREAPPLICATION_URL}npextorg/extnonprod/retrieve-company-information/company-id?idNumber={idNumber}`
    *   **Purpose**: Retrieves detailed company registration data for the user.

*   **API Endpoint**: `/api/get-company-directors?idNumber={regNum}`
    *   **Method**: `GET`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/retrieve-company-information/company-id?idNumber={idNumber}`
    *   **Purpose**: Verifies if the current user is a director of the selected company (uses same backend endpoint as retrieve info).

*   **API Endpoint**: `/api/get-company-info?idNumber={regNum}`
    *   **Method**: `GET`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/retrieve-company-information/company-id?idNumber={idNumber}`
    *   **Purpose**: Fetches additional details about the selected company (uses same backend endpoint as retrieve info).

*   **API Endpoint**: `/api/pre-application`
    *   **Method**: `POST`
    *   **Real Target**: `${NEXT_PUBLIC_PREAPPLICATION_URL}npextorg/extnonprod/business-lending-mymobiz/pre-application`
    *   **Purpose**: Submits the initial application data.

## 4. OTP Verification
### Screen: `app/account-onboarding/otp/page.tsx`
*   **API Endpoint**: `/api/otp-token`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/sysauth/oauth2/token`
    *   **Purpose**: Generates a token for OTP services.

*   **API Endpoint**: `/api/send-otp`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/unsecured-lending/otp`
    *   **Purpose**: Sends an OTP (SOAP payload converted).

*   **API Endpoint**: `/api/verify-otp`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/unsecured-lending/otp`
    *   **Purpose**: Verifies the OTP (SOAP payload converted).

## 5. Company Details Update
### Screen: `components/simplyblu-application-steps/CompanyDetails.tsx`
*   **API Endpoint**: `/api/company-details`
    *   **Method**: `PUT`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/company-details-for-ao/company`
    *   **Purpose**: Updates the company's address, industry, and B-BBEE details.

## 6. Marketing Consents & Related Parties
### Screen: `components/simplyblu-application-steps/MarketingConsentForm.tsx`
*   **API Endpoint**: `/api/company-details`
    *   **Method**: `PUT`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/company-details-for-ao/company`
    *   **Purpose**: Updates consent flags.

*   **API Endpoint**: `/api/related-parties?customerUUID={uuid}`
    *   **Method**: `GET`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/related-parties/retrieve-party?customerUUID={uuid}`
    *   **Purpose**: Fetches the list of related parties.

*   **API Endpoint**: `/api/related-parties-update`
    *   **Method**: `PUT`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/related-party-details-for-ao/manage-party`
    *   **Purpose**: Updates related parties information.

## 7. Company Banking Details
### Screen: `components/simplyblu-application-steps/CompanyBankingDetails.tsx`
*   **API Endpoint**: `/api/get-pay-account?partnerGuid={guid}&offerId={id}`
    *   **Method**: `GET`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/nominated/partners/{partnerGuid}/pay-account?offerid={offerId}`
    *   **Purpose**: Fetches existing Standard Bank accounts.

*   **API Endpoint**: `/api/verify-account`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/account-verification/verify`
    *   **Purpose**: Verifies the entered bank account details.

## 8. Offer Acceptance & Contract
### Screen: `components/simplyblu-application-steps/AcceptOffer.tsx`
*   **API Endpoint**: `/api/set-digital-offer`
    *   **Method**: `PUT`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/digital-offer-mymobiz/offer/{offerId}`
    *   **Purpose**: Records acceptance of the digital offer.

### Screen: `components/simplyblu-application-steps/CardMachineSummary.tsx`
*   **API Endpoint**: `/api/create-contract`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/application/offer/{offerId}/contract`
    *   **Purpose**: Generates the legal contract.

*   **API Endpoint**: `/api/retrieve-document`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/retrieve/documents`
    *   **Purpose**: Retrieves the generated contract document.

## 9. Contract Signing (OTC)
### Screen: `app/account-onboarding/contract-signing-otp/page.tsx`
*   **API Endpoint**: `/api/otp-token`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/sysauth/oauth2/token`
    *   **Purpose**: Generates a token specifically for the contract signing OTP.

*   **API Endpoint**: `/api/send-otp`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/unsecured-lending/otp`
    *   **Purpose**: Sends the OTP to the user's mobile for contract signature.

*   **API Endpoint**: `/api/verify-otp`
    *   **Method**: `POST`
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/unsecured-lending/otp`
    *   **Purpose**: Verifies the entered OTP to electronically sign the contract.

## 10. Application Submission
### Screen: `app/account-onboarding/contract-signing-otp/page.tsx` (Triggered after successful OTP)
*   **API Endpoint**: `/api/process-application` (Step 1)
    *   **Method**: `POST` (Proxy) -> `PUT` (Backend)
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/applications/applications`
    *   **Purpose**: Updates the application status with the Process Identifier.

*   **API Endpoint**: `/api/process-application` (Step 2)
    *   **Method**: `POST` (Proxy) -> `PUT` (Backend)
    *   **Real Target**: `${https://api-gatewaynp.standardbank.co.za/npextorg/extnonprod}/applications/applications`
    *   **Purpose**: Updates the application status to confirm successful facial recognition and finalizes the submission.
