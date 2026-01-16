/**
 * Mapping functions for form values to API codes
 */

const businessTypeMap: Record<string, string> = {
  "sole-proprietor": "002",
  "partnership": "003",
  "cc": "004",
  "pty-ltd": "005",
  "trust": "006",
};

const provinceMap: Record<string, string> = {
  "ZAF.GP": "ZA-GP",
  "ZAF.WC": "ZA-WC",
  "ZAF.KZN": "ZA-NL",
  "ZAF.EC": "ZA-EC",
  "ZAF.FS": "ZA-FS",
  "ZAF.LP": "ZA-LP",
  "ZAF.MP": "ZA-MP",
  "ZAF.NW": "ZA-NW",
  "ZAF.NC": "ZA-NC",
};

const bbbeeMap: Record<string, string> = {
  "level-1": "01",
  "level-2": "02",
  "level-3": "03",
  "level-4": "04",
  "level-5": "05",
  "level-6": "06",
  "level-7": "07",
  "level-8": "08",
  "non-compliant": "09",
};

const ownershipMap: Record<string, string> = {
  "0-25": "01",
  "26-50": "02",
  "51-100": "03",
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

const entityClassificationMap: Record<string, string> = {
  "MIE": "MIE",
  "SME": "SME",
  "Corporate": "COR",
};

const natureOfBusinessMap: Record<string, string> = {
  "retail": "01",
  "wholesale": "02",
  "manufacturing": "03",
  "services": "04",
  "hospitality": "05",
  "construction": "06",
  "agriculture": "07",
  "transport": "08",
  "technology": "09",
  "healthcare": "10",
  "education": "11",
  "financial-services": "12",
  "real-estate": "13",
  "professional-services": "14",
  "automotive": "15",
  "entertainment": "16",
  "telecommunications": "17",
  "energy": "18",
  "mining": "19",
  "other": "99",
};

const industryClassificationMap: Record<string, string> = {
  // Agriculture, forestry and fishing
  "agriculture": "74120",
  "forestry": "02100",
  "fishing": "03110",

  // Mining and quarrying
  "mining-coal": "05100",
  "mining-metal": "07100",
  "mining-other": "08990",

  // Manufacturing
  "food-manufacturing": "10100",
  "beverage-manufacturing": "11010",
  "textile-manufacturing": "13110",
  "clothing-manufacturing": "14100",
  "leather-manufacturing": "15110",
  "wood-manufacturing": "16100",
  "paper-manufacturing": "17010",
  "printing": "18110",
  "chemical-manufacturing": "20110",
  "pharmaceutical-manufacturing": "21000",
  "rubber-plastic-manufacturing": "22190",
  "metal-manufacturing": "24100",
  "electronics-manufacturing": "26100",
  "electrical-equipment": "27100",
  "machinery-manufacturing": "28130",
  "motor-vehicle-manufacturing": "29100",
  "furniture-manufacturing": "31000",

  // Electricity, gas, steam
  "electricity-supply": "35100",
  "water-supply": "36000",

  // Construction
  "construction-buildings": "41000",
  "civil-engineering": "42100",
  "construction-specialized": "43900",

  // Wholesale and retail trade
  "motor-vehicle-sales": "45100",
  "wholesale-trade": "46900",
  "retail-trade": "47110",

  // Transportation and storage
  "land-transport": "49210",
  "water-transport": "50110",
  "air-transport": "51100",
  "warehousing": "52100",

  // Accommodation and food
  "accommodation": "55100",
  "food-service": "56100",

  // Information and communication
  "publishing": "58110",
  "broadcasting": "60100",
  "telecommunications": "61100",
  "it-services": "62010",
  "information-services": "63110",

  // Financial and insurance
  "financial-services": "64190",
  "insurance": "65120",
  "financial-auxiliary": "66190",

  // Real estate
  "real-estate": "68100",

  // Professional, scientific and technical
  "legal-accounting": "69100",
  "consulting": "70200",
  "architecture-engineering": "71100",
  "research-development": "72100",
  "advertising": "73100",
  "veterinary": "75000",

  // Administrative and support
  "rental-leasing": "77100",
  "employment-services": "78100",
  "travel-services": "79110",
  "security-services": "80100",
  "facilities-services": "81100",
  "office-support": "82190",

  // Education
  "education": "85100",

  // Health and social work
  "healthcare": "86100",
  "social-work": "87100",

  // Arts, entertainment and recreation
  "arts-entertainment": "90000",
  "gambling": "92000",
  "sports-recreation": "93110",

  // Other service activities
  "membership-organizations": "94110",
  "repair-services": "95110",
  "personal-services": "96020",

  // Other
  "other": "99000",
};

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

  // Handle both old field names (businessNature, businessIndustry) 
  // and new field names (natureOfBusiness, industryClassification)
  const businessType = formData.businessType;
  const businessName = formData.registeredCompanyName || formData.businessName;
  
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
  // For incorporated entities, try to use company registration number
  let identificationNumber = "";
  
  if (isUnincorporated) {
    // Use personal ID for sole proprietors
    identificationNumber = personalData.idNo || formData.ownerIdNumber || registrationNumber || "";
  } else {
    // For incorporated entities (partnership, cc, pty-ltd, trust)
    // Use company registration number if available
    const companyRegistration = formData.registrationNumber || formData.regNo;
    
    // If we have a proper registration number (from companyDetailsFormData), use it
    if (companyRegistration && companyRegistration !== personalData.idNo && companyRegistration !== merchantData?.businessDetails?.directorId) {
      identificationNumber = companyRegistration;
    } else {
      // Fall back to available number (may need company registration from form)
      identificationNumber = companyRegistration || merchantData?.businessDetails?.directorId || "";
      
      // Log warning if we're using a personal ID for an incorporated entity
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn(
          `⚠️ Company Details Transformer: ${ownership} entity using ID "${identificationNumber}" which appears to be a personal ID. ` +
          `Please provide a proper company registration number in the companyDetailsFormData.`
        );
      }
    }
  }

  // Build KYC Address
  const kycAddress = {
    province: businessProvince || "",  // Keep original ZAF.XX format, don't map
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
        telephone: businessTel || "",
        taxNumber: taxNumberArray,
        sourceOfFunds: sourceOfFundsArray,
        preferredBranch: formData.preferredBranch || "13477",
        ownership: ownershipMap[ownership] || ownership || "",
        // IMPORTANT: Map businessNature to code
        natureOfBusiness: natureOfBusinessMap[businessNature] || businessNature || "",
        kycAddress: kycAddress,
        // IMPORTANT: Map businessIndustry to code
        industryClassification: industryClassificationMap[businessIndustry] || businessIndustry || "",
        identificationType: identificationType,
        identificationNumber: identificationNumber,
        identificationCountry: "ZA",
        fiscalMonthEnd: "",
        entityClassification: entityClassificationMap[entityClassification] || entityClassification || "",
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
        businessType: businessTypeMap[businessType] || businessType || "",
        businessName: businessName || "",
        blackWomenOwnerPercentage: blackWomanOwnership || "",
        beeCode: "",
        bbbeeContributioLevel: bbbeeMap[bbbeeContributionLevel] || bbbeeContributionLevel || "",
        bbbeeCertIssuedate: formatDate(bbbeeCertificateDate),
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
