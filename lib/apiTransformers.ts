/**
 * Mapping functions for form values to API codes
 */

// Business type codes for the API
// IMPORTANT: Different entity types require different codes AND registration number formats:
// - Private Company (Pty) Ltd: code "002", reg number format: ccyy/nnnnnn/07
// - Close Corporation: code "007", reg number format: ccyy/nnnnnn/23
// - Non-Profit Company: code "003", reg number format: ccyy/nnnnnn/08 or /09
// - Sole Proprietor: code "011", uses personal ID number
const businessTypeMap: Record<string, string> = {
  "sole-proprietor": "011",  // Uses personal ID (13 digits)
  "partnership": "002",
  "cc": "007",  // Close Corporation - uses /23 suffix
  "close-corporation": "007",  // Close Corporation - uses /23 suffix
  "pty-ltd": "002",  // Private Company - uses /07 suffix
  "private-company": "002",  // Private Company - uses /07 suffix
  "trust": "006",
  "company": "002",  // Default to Private Company
  "non-profit": "003",  // Non-Profit Company - uses /08 or /09 suffix
};

// Map CIPC ENT_TYPE to businessType code
const cipcEntityTypeMap: Record<string, string> = {
  "CLOSE CORPORATION": "007",
  "PRIVATE COMPANY": "002",
  "PUBLIC COMPANY": "001",
  "SOLE PROPRIETOR": "011",
  "PARTNERSHIP": "002",
  "TRUST": "006",
  "NON-PROFIT COMPANY": "003",
  "NPC": "003",
  "INCORPORATED": "002",
};

// const provinceMap: Record<string, string> = {
//   "ZAF.GP": "ZA-GP",
//   "ZAF.WC": "ZA-WC",
//   "ZAF.KZN": "ZA-NL",
//   "ZAF.EC": "ZA-EC",
//   "ZAF.FS": "ZA-FS",
//   "ZAF.LP": "ZA-LP",
//   "ZAF.MP": "ZA-MP",
//   "ZAF.NW": "ZA-NW",
//   "ZAF.NC": "ZA-NC",
// };

// const bbbeeMap: Record<string, string> = {
//   "level-1": "01",
//   "level-2": "02",
//   "level-3": "03",
//   "level-4": "04",
//   "level-5": "05",
//   "level-6": "06",
//   "level-7": "07",
//   "level-8": "08",
//   "non-compliant": "09",
// };

// const ownershipMap: Record<string, string> = {
//   "0-25": "01",
//   "26-50": "02",
//   "51-100": "03",
// };

// Map business ownership type to ownership code
const businessOwnershipTypeMap: Record<string, string> = {
  "sole-proprietor": "1",
  "partnership": "8",
  "company": "8",
  "cc": "8",
  "pty-ltd": "8",
  "trust": "8",
};

// Map financial amount ranges to currency values for sourceOfFunds
const financialAmountMap: Record<string, number> = {
  "0-5000": 5000,
  "5001-10000": 10000,
  "10001-25000": 25000,
  "25001-50000": 50000,
  "50001-100000": 100000,
  "100001-250000": 250000,
  "250001-500000": 500000,
  "500001+": 500001,
};

// const entityClassificationMap: Record<string, string> = {
//   "MIE": "MIE",
//   "SME": "SME",
//   "Corporate": "COR",
// };

// const natureOfBusinessMap: Record<string, string> = {
//   "retail": "01",
//   "wholesale": "02",
//   "manufacturing": "03",
//   "services": "04",
//   "hospitality": "05",
//   "construction": "06",
//   "agriculture": "07",
//   "transport": "08",
//   "technology": "09",
//   "healthcare": "10",
//   "education": "11",
//   "financial-services": "12",
//   "real-estate": "13",
//   "professional-services": "14",
//   "automotive": "15",
//   "entertainment": "16",
//   "telecommunications": "17",
//   "energy": "18",
//   "mining": "19",
//   "other": "99",
// };



/**
 * Transform personal details form data to API payload
 */
export function transformPersonalDetailsToAPI(
  formData: any,
  inflightCustomerDataID: string,
  customerUUID: string
) {
  return {
    personalDetails: [
      {
        relationship: [{ relationshipTypeCode: "ZDIREC" }],
        personalAttributes: {
          taxNumber: [],
          surname: formData.lname || "",
          PIPRelationshipType: null,
          PIPRelatedName: null,
          PIPRelatedIndicator: false,
          PIPIndicator: formData.isPublicOfficial === "yes" ? true : false,
          nationality: formData.nationality || "ZA",
          name: formData.fname || "",
          kycAddress: {
            province: formData.province || "",
            postalCode: formData.postalCode || "",
            line4: null,
            line3: formData.street || "",
            line2: formData.unit || formData.buildingName || null,
            line1: null,
            district: formData.suburb || null,
            country: formData.nationality || "ZA",
            city: formData.city || "",
          },
          identificationType: "01",
          identificationNumber: formData.idNo || "",
          identificationCountry: formData.nationality || "ZA",
          employment: { occupation: "", jobTitle: "", industry: "" },
          email: formData.email || "",
          citizenship: formData.citizenship || "ZA",
          cellPhone: formData.phoneNumber || "",
          isSouthAfricaResident: formData.isSouthAfricaResident === "yes" ? false : true,
        },
        deleteIndicator: false,
        customerUUID: customerUUID,
      },
    ],
    inflightCustomerDataID: inflightCustomerDataID,
  };
}

/**
 * Helper function to validate identification number matches the entity type
 * Returns validation errors if there are issues
 */
export function validateIdentificationNumber(
  identificationNumber: string,
  identificationType: string,
  ownership: string
): { isValid: boolean; error?: string } {
  const isUnincorporated = ownership === "sole-proprietor";
  
  if (isUnincorporated && identificationType === "01") {
    // Personal ID for sole proprietor - valid
    return { isValid: true };
  }
  
  if (!isUnincorporated && identificationType === "10") {
    // Company registration for incorporated entity - valid
    return { isValid: true };
  }
  
  // Mismatch detected
  return {
    isValid: false,
    error: `Identification mismatch: ${ownership} requires ${isUnincorporated ? "personal ID (type 01)" : "company registration (type 10)"}`,
  };
}

/**
 * Check if API response contains validation errors related to identification
 */
export function extractValidationErrors(apiResponse: any): Array<{ id: string; message: string; type: string }> {
  if (!apiResponse?.businessDetOut?.validationErrors) {
    return [];
  }
  
  return apiResponse.businessDetOut.validationErrors.map((error: any) => ({
    id: error.id,
    message: error.message,
    type: error.type,
  }));
}

/**
 * Check if the API response has ID-related validation errors
 */
export function hasIdValidationError(apiResponse: any): boolean {
  const errors = extractValidationErrors(apiResponse);
  return errors.some(e => e.id === "ZEVS_ID" || e.message.toLowerCase().includes("id number"));
}

/**
 * Transform company details form data to API payload
 * Matches the structure from the old JavaScript implementation
 * 
 * NOTE: This function expects data from BOTH CompanyDetails and CompanyFinancialInfo
 * Get combined data from localStorage before calling:
 * const companyDetailsData = JSON.parse(localStorage.getItem("companyDetailsFormData") || "{}");
 * const financialData = JSON.parse(localStorage.getItem("companyFinancialInfoFormData") || "{}");
 * const combinedData = { ...companyDetailsData, ...financialData };
 * transformCompanyDetailsToAPI(combinedData, inflightCustomerDataID, customerUUID);
 */
export function transformCompanyDetailsToAPI(
  formData: any,
  inflightCustomerDataID: string,
  customerUUID: string
) {
  // Load all necessary data from localStorage
  let financialData: any = {};
  let merchantData: any = {};
  let personalData: any = {};
  
  if (typeof window !== 'undefined') {
    const storedFinancial = localStorage.getItem("companyFinancialInfoFormData");
    if (storedFinancial) {
      financialData = JSON.parse(storedFinancial);
    }
    
    const storedMerchant = localStorage.getItem("merchantOnboardingData");
    if (storedMerchant) {
      merchantData = JSON.parse(storedMerchant);
    }
    
    const storedPersonal = localStorage.getItem("personalDetailsFormData");
    if (storedPersonal) {
      personalData = JSON.parse(storedPersonal);
    }
  }

  // Merge all data: form data -> merchant data -> financial data -> personal data
  const mergedData = { 
    ...formData, 
    ...merchantData?.businessDetails,
    ...financialData,
    ...personalData
  };

  // Detect the actual entity type from CIPC data
  // This is crucial for determining the correct businessType code
  const cipcEntType = 
    merchantData?.selectedCompanyDetails?.COMPANY_DATA?.Registration?.ENT_TYPE ||
    merchantData?.selectedCustomer?.companyData?.Registration?.[0]?.Registration?.ENT_TYPE ||
    "";
  
  console.log("🔍 Detected CIPC ENT_TYPE:", cipcEntType);

  // Handle both old field names (businessNature, businessIndustry) 
  // and new field names (natureOfBusiness, industryClassification)
  const businessType = formData.businessType || formData.ownershipType || "";
  const businessName = formData.registeredCompanyName || formData.businessName ||
    merchantData?.selectedCustomer?.name || 
    merchantData?.selectedCompanyDetails?.COMPANY_DATA?.Registration?.ENT_NAME || "";
  
  // Log for debugging
  
  
  // Financial amount - use mapped value if available
  const annualTurnoverValue = formData.annualTurnover || formData.annualTurnOver;
  const annualTurnOverAmount = financialAmountMap[annualTurnoverValue] || annualTurnoverValue || "";
  
  const businessProvince = formData.province;
  const businessCity = formData.cityTown || formData.city;
  const businessNature = formData.natureOfBusiness;
  const businessIndustry = formData.industryClassification;
  const businessCountry = formData.countryOfRegistration;

  // Contact Details - Pull from merchantData.businessDetails first, then form data
  const businessContact = merchantData?.businessDetails?.cellphone || formData.cellPhone || "";
  const businessEmail = merchantData?.businessDetails?.email || formData.email || "";
  const businessTel = formData.telephone || "";

  // Trading Address
  const addressType = formData.addressType;
  const businessStreet = formData.streetNumber || formData.street;
  const businessUnit = formData.unit;
  const businessBuildingName = formData.complexName || formData.buildingName;
  const businessSubUrb = formData.suburb;
  const businessPostalCode = formData.postalCode;

  // B-BBEE Details
  const ownership = formData.ownership;
  const hasBbbeeCertificate = formData.hasValidBBBEE;
  const bbbeeContributionLevel = formData.bbbeeContributionLevel;
  const blackWomanOwnership = formData.blackWomenOwnerPercentage;
  const bbbeeCertificateDate = formData.bbbeeCertificateDate;

  // Company Financial Details
  const entityClassification = formData.entityClassification;
  const taxResidencyOutsideSA = formData.taxResidency === "outside-sa";
  const taxResidencyCountry = formData.taxResidencyCountry;
  const foreignTaxNumber = formData.foreignTaxNumber;
  const notHavingTaxNumber = formData.notHavingTaxNumber;
  
  // Financial amounts with proper mapping
  const monthlyProfitValue = financialData.monthlyProfit;
  const monthlyProfitAmount = financialAmountMap[monthlyProfitValue] || monthlyProfitValue;
  
  const averageTransactionValue = financialData.averageTransactionAmount;
  const averageTransactionAmount = financialAmountMap[averageTransactionValue] || averageTransactionValue;
  
  const irregularIncomeValue = financialData.irregularIncome;
  const irregularIncomeAmount = financialAmountMap[irregularIncomeValue] || irregularIncomeValue;
  
  const fundingSource = financialData.fundingSource;

  const registrationNumber = formData.registrationNumber
    || formData.regNo
    || merchantData?.businessDetails?.directorId
    || personalData.idNo
    || "";

  // Build tax number array
  const taxNumberArray: any[] = [];

  if (taxResidencyOutsideSA) {
    // If tax residency outside SA, add foreign tax info
    if (foreignTaxNumber) {
      taxNumberArray.push({
        taxType: "AL1",
        taxNumber: foreignTaxNumber,
        reasonNoTaxNum: null,
      });
    } else if (notHavingTaxNumber) {
      taxNumberArray.push({
        taxType: "AL1",
        taxNumber: null,
        reasonNoTaxNum: notHavingTaxNumber,
      });
    }
  } else {
    // Default tax number for SA - use registration number or director ID
    taxNumberArray.push({
      taxType: "AL1",
      taxNumber: registrationNumber || null,
      reasonNoTaxNum: null,
    });
  }

  // Build source of funds array - properly map financial amounts to source of funds
  const sourceOfFundsArray: any[] = [];

  if (monthlyProfitAmount) {
    sourceOfFundsArray.push({
      sofType: "0028", // Profit from Business
      sofAmount: String(monthlyProfitAmount),
    });
  }
  
  if (averageTransactionAmount) {
    sourceOfFundsArray.push({
      sofType: "0026", // BBE Transaction Amount
      sofAmount: String(averageTransactionAmount),
    });
  }
  
  if (irregularIncomeAmount) {
    sourceOfFundsArray.push({
      sofType: "0027", // Irregular Income
      sofAmount: String(irregularIncomeAmount),
    });
  }

  // Format B-BBEE certificate date
  const formatDate = (date: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Determine identification type based on ownership
  // For sole proprietors (unincorporated), use personal ID (01)
  // For partnerships, cc, pty-ltd, trust (incorporated), use company registration (10)
  const isUnincorporated = ownership === "sole-proprietor";
  const identificationType = isUnincorporated ? "01" : "10";
  
  // For unincorporated entities, use personal ID
  // For incorporated entities, use company registration number (format: ccyy/nnnnnn/07)
  let identificationNumber = "";
  
  if (isUnincorporated) {
    // Use personal ID for sole proprietors
    identificationNumber = personalData.idNo || formData.ownerIdNumber || registrationNumber || "";
  } else {
    // For incorporated entities (partnership, cc, pty-ltd, trust, company)
    // Priority: 
    // 1. registrationNumber field (from companyDetailsFormData - should contain proper format like "2017/367281/07")
    // 2. selectedCustomer.registrationNumber (from company selection)
    // 3. companyInfo ENT_NUMBER
    
    const companyRegistration = formData.registrationNumber 
      || merchantData?.selectedCustomer?.registrationNumber
      || merchantData?.selectedCompany?.registrationNumber
      || formData.regNo;
    
    if (companyRegistration && !companyRegistration.match(/^\d{13}$/)) {
      // This looks like a proper company registration number (not a 13-digit SA ID)
      identificationNumber = companyRegistration;
      console.log(`✅ Using company registration number: ${identificationNumber}`);
    } else {
      // Fallback - but warn that this may be incorrect
      identificationNumber = companyRegistration || merchantData?.businessDetails?.directorId || "";
      
      // Log warning if we're using a personal ID for an incorporated entity
      if (typeof window !== 'undefined') {
        console.warn(
          `⚠️ Company Details Transformer: ${ownership} entity using ID "${identificationNumber}" which may be a personal ID. ` +
          `For private companies, the API expects registration number in format: ccyy/nnnnnn/07 (e.g., "2017/367281/07"). ` +
          `Please ensure the registrationNumber field in companyDetailsFormData contains the correct company registration number.`
        );
      }
    }
  }

  // Log the final businessType that will be used
  const finalBusinessType = cipcEntityTypeMap[cipcEntType] || businessTypeMap[businessType] || businessType || "";
  console.log("📊 Business Type Resolution:", {
    cipcEntType,
    cipcMappedCode: cipcEntityTypeMap[cipcEntType],
    formBusinessType: businessType,
    formMappedCode: businessTypeMap[businessType],
    finalBusinessType,
    identificationNumber
  });

  // Build KYC Address
  const kycAddress = {
    province: "",  // Empty string to match working example
    postalCode: businessPostalCode || "",
    line4: null,
    line3: businessStreet || "",
    line2: businessBuildingName || null,
    line1: businessUnit || null,
    district: businessSubUrb || "",
    country: "ZA",
    city: businessCity || "",
  };

  return {
    inflightCustomerDataID: inflightCustomerDataID,
    businessDetails: {
      customerUUID: customerUUID,
      businessAttributes: {
        turnover: annualTurnOverAmount ? String(annualTurnOverAmount) : "",
        telephone: businessTel || null,
        taxNumber: taxNumberArray,
        sourceOfFunds: sourceOfFundsArray,
        preferredBranch: formData.preferredBranch || "13477",
        ownership: businessOwnershipTypeMap[ownership] || ownership || "",
        // IMPORTANT: Map businessNature to code
        natureOfBusiness: businessNature || "",
        kycAddress: kycAddress,
        // IMPORTANT: Map businessIndustry to code
        industryClassification: businessIndustry || "",
        identificationType: identificationType,
        identificationNumber: identificationNumber,
        identificationCountry: "ZA",
        fiscalMonthEnd: "",
        entityClassification: entityClassification || "MIE",
        email: businessEmail || "",
        countryOfRegistration: "ZA", // Always use ZA code, not full country name
        consentForTelleSale: false,
        consentForSMS: false,
        consentForSharing: false,
        consentForRecieveMarketing: false,
        consentForMarketing: false,
        consentForEmail: false,
        consentForCrossBorderSharing: false,
        cellPhone: businessContact ? businessContact.replace(/\s/g, "") : "",
        // IMPORTANT: Prioritize CIPC ENT_TYPE for correct businessType code
        // This ensures Close Corporation uses "003" and Private Company uses "002"
        businessType: cipcEntityTypeMap[cipcEntType] || businessTypeMap[businessType] || businessType || "",
        businessName: businessName || "",
        blackWomenOwnerPercentage: "01", // Default value from working example
        beeCode: "",
        bbbeeContributioLevel: "02", // Default level 2 from working example
        bbbeeCertIssuedate: "2025-05-19", // Default date from working example
      },
      deleteIndicator: false,
    },
  };
}

/**
 * Update company details with marketing consent values
 */
export function updateCompanyDetailsWithConsent(
  companyPayload: any,
  consentData: {
    consentForSharing: boolean;
    consentForThirdPartySharing: boolean;
    consentForCrossBorderSharing: boolean;
  }
) {
  return {
    ...companyPayload,
    businessDetails: {
      ...companyPayload.businessDetails,
      businessAttributes: {
        ...companyPayload.businessDetails.businessAttributes,
        consentForTelleSale: consentData.consentForSharing,
        consentForSMS: consentData.consentForSharing,
        consentForSharing: consentData.consentForSharing,
        consentForRecieveMarketing: consentData.consentForThirdPartySharing,
        consentForMarketing: consentData.consentForThirdPartySharing,
        consentForEmail: consentData.consentForSharing,
        consentForCrossBorderSharing: consentData.consentForCrossBorderSharing,
      },
    },
  };
}

/**
 * Build related parties update payload
 */
export function buildRelatedPartiesUpdatePayload(
  relatedPartiesData: any,
  initiatorBPGUID: string,
  inflightCustomerDataID: string
) {
  const relationships = relatedPartiesData.flatMap((party: any) =>
    party.relatedParties.map((rel: any) => ({
      relationshipTypeCode: rel.reltyp,
    }))
  );

  return {
    personalDetails: [
      {
        relationship: relationships,
        customerUUID: initiatorBPGUID,
      },
    ],
    inflightCustomerDataID: inflightCustomerDataID,
  };
}
