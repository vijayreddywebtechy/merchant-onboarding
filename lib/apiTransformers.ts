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
 * Transform company details form data to API payload
 * Matches the structure from the old JavaScript implementation
 */
export function transformCompanyDetailsToAPI(
  formData: any,
  inflightCustomerDataID: string,
  customerUUID: string
) {
  // Get merchant data from localStorage for missing fields
  const merchantData = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}")
    : {};
  
  const personalData = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem("personalDetailsFormData") || "{}")
    : {};
  
  const registrationNumber = formData.registrationNumber 
    || formData.regNo 
    || merchantData.businessDetails?.directorId 
    || "";

  // Build tax number array
  const taxNumberArray: any[] = [];
  if (registrationNumber) {
    taxNumberArray.push({
      taxType: "AL1",
      taxNumber: registrationNumber,
      reasonNoTaxNum: null,
    });
  }

  // Build source of funds array (can be expanded based on form data)
  const sourceOfFundsArray: any[] = [];

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
  // For companies, use company registration (10)
  const isSoleProprietor = formData.ownership === "sole-proprietor";
  const identificationType = isSoleProprietor ? "01" : "10";
  const identificationNumber = isSoleProprietor 
    ? (personalData.idNo || formData.ownerIdNumber || registrationNumber)
    : registrationNumber;

  return {
    inflightCustomerDataID: inflightCustomerDataID,
    businessDetails: {
      customerUUID: customerUUID,
      businessAttributes: {
        turnover: formData.annualTurnover || merchantData.businessDetails?.grossTurnover || "",
        telephone: formData.businessTel || personalData.phoneNumber || "",
        taxNumber: taxNumberArray,
        sourceOfFunds: sourceOfFundsArray,
        preferredBranch: formData.preferredBranch || "13477",
        ownership: ownershipMap[formData.ownership] || formData.ownership || "",
        natureOfBusiness: natureOfBusinessMap[formData.natureOfBusiness] || formData.natureOfBusiness || "",
        kycAddress: {
          province: formData.province || "",
          postalCode: formData.postalCode || "",
          line4: null,
          line3: formData.streetNumber || "",
          line2: formData.complexName || null,
          line1: formData.unit || null,
          district: formData.suburb || "",
          country: "ZA",
          city: formData.cityTown || "",
        },
        industryClassification: industryClassificationMap[formData.industryClassification] || formData.industryClassification || "",
        identificationType: identificationType,
        identificationNumber: identificationNumber,
        identificationCountry: "ZA",
        fiscalMonthEnd: "",
        entityClassification: entityClassificationMap[formData.entityClassification] || formData.entityClassification || "",
        email: formData.email || personalData.email || "",
        countryOfRegistration: "ZA", // Always use ZA code, not full country name
        consentForTelleSale: false,
        consentForSMS: false,
        consentForSharing: false,
        consentForRecieveMarketing: false,
        consentForMarketing: false,
        consentForEmail: false,
        consentForCrossBorderSharing: false,
        cellPhone: formData.phoneNumber || personalData.phoneNumber || "",
        businessType: businessTypeMap[formData.businessType] || formData.businessType || "",
        businessName: formData.registeredCompanyName || formData.businessName || "",
        blackWomenOwnerPercentage: formData.blackWomanOwnership || "",
        beeCode: "",
        bbbeeContributioLevel: bbbeeMap[formData.bbbeeContributionLevel] || formData.bbbeeContributionLevel || "",
        bbbeeCertIssuedate: formatDate(formData.bbbeeCertificateDate),
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
