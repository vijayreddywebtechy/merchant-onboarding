/**
 * Dropdown options for the application
 * All select/dropdown values are defined here for reusability
 */

import type { SelectOption } from "@/components/dynamic/CustomSelect";

export const yesOrNoOptions: SelectOption[] = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const companyOrHome: SelectOption[] = [
  { label: "Company Trading Address", value: "company" },
  { label: "Personal address", value: "home" },
  { label: "New Address", value: "new" },
];

export const buyOrRentOptions: SelectOption[] = [
  { label: "Rent", value: "rent" },
  { label: "Buy", value: "buy" },
];

export const provinceOptions: SelectOption[] = [
  { value: "ZAF.GP", label: "Gauteng" },
  { value: "ZAF.WC", label: "Western Cape" },
  { value: "ZAF.KZN", label: "KwaZulu-Natal" },
  { value: "ZAF.EC", label: "Eastern Cape" },
  { value: "ZAF.FS", label: "Free State" },
  { value: "ZAF.LP", label: "Limpopo" },
  { value: "ZAF.MP", label: "Mpumalanga" },
  { value: "ZAF.NW", label: "North West" },
  { value: "ZAF.NC", label: "Northern Cape" },
];

export const cityOptions: SelectOption[] = [
  { value: "johannesburg", label: "Johannesburg" },
  { value: "cape-town", label: "Cape Town" },
  { value: "durban", label: "Durban" },
  { value: "pretoria", label: "Pretoria" },
  { value: "port-elizabeth", label: "Port Elizabeth" },
];

export const businessTypeOptions: SelectOption[] = [
  { value: "sole-proprietor", label: "Sole Proprietor/Other" },
];

export const addressOptions: SelectOption[] = [
  { value: "same", label: "Same as residential address" },
  { value: "different", label: "Different address" },
];

export const countryOptions: SelectOption[] = [
  { value: "ZA", label: "South Africa" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "ZW", label: "Zimbabwe" },
  { value: "BW", label: "Botswana" },
  { value: "NA", label: "Namibia" },
  { value: "MZ", label: "Mozambique" },
  { value: "LS", label: "Lesotho" },
  { value: "SZ", label: "Eswatini" },
];

export const nationalityOptions: SelectOption[] = [
  { value: "ZA", label: "South African" },
  { value: "US", label: "American" },
  { value: "GB", label: "British" },
  { value: "CA", label: "Canadian" },
  { value: "AU", label: "Australian" },
  { value: "NZ", label: "New Zealander" },
  { value: "ZW", label: "Zimbabwean" },
  { value: "BW", label: "Motswana" },
  { value: "NA", label: "Namibian" },
  { value: "MZ", label: "Mozambican" },
  { value: "LS", label: "Basotho" },
  { value: "SZ", label: "Swazi" },
];

export const bbbeeContributionLevelOptions: SelectOption[] = [
  { value: "level-1", label: "Level 1" },
  { value: "level-2", label: "Level 2" },
  { value: "level-3", label: "Level 3" },
  { value: "level-4", label: "Level 4" },
  { value: "level-5", label: "Level 5" },
  { value: "level-6", label: "Level 6" },
  { value: "level-7", label: "Level 7" },
  { value: "level-8", label: "Level 8" },
  { value: "non-compliant", label: "Non-Compliant" },
];

export const blackWomanOwnershipOptions: SelectOption[] = [
  { value: "0-25", label: "0% - 25%" },
  { value: "26-50", label: "26% - 50%" },
  { value: "51-75", label: "51% - 75%" },
  { value: "76-100", label: "76% - 100%" },
];

export const entityClassificationOptions: SelectOption[] = [
  { value: "financial-institution", label: "Financial Institution" },
  { value: "non-financial-entity", label: "Non-Financial Entity" },
  { value: "active-nfe", label: "Active NFE" },
  { value: "passive-nfe", label: "Passive NFE" },
];

export const businessFundingOptions: SelectOption[] = [
  { value: "personal-savings", label: "Personal Savings" },
  { value: "bank-loan", label: "Bank Loan" },
  { value: "investors", label: "Investors" },
  { value: "family-friends", label: "Family/Friends" },
  { value: "grants", label: "Grants" },
  { value: "other", label: "Other" },
];

export const amountRangeOptions: SelectOption[] = [
  { value: "0-5000", label: "R 0 - R 5,000" },
  { value: "5001-10000", label: "R 5,001 - R 10,000" },
  { value: "10001-25000", label: "R 10,001 - R 25,000" },
  { value: "25001-50000", label: "R 25,001 - R 50,000" },
  { value: "50001-100000", label: "R 50,001 - R 100,000" },
  { value: "100001+", label: "R 100,001+" },
];

export const taxResidencyReasonOptions: SelectOption[] = [
  { value: "not-required", label: "Not required to obtain" },
  { value: "unable-to-obtain", label: "Unable to obtain" },
  { value: "other", label: "Other" },
];

export const machineOptions: SelectOption[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

export const deliveryTypeOptions: SelectOption[] = [
  { value: "standard", label: "Standard Delivery" },
  { value: "express", label: "Express Delivery" },
];

export const businessNatureOptions: SelectOption[] = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Services" },
  { value: "hospitality", label: "Hospitality & Food" },
  { value: "construction", label: "Construction" },
  { value: "agriculture", label: "Agriculture" },
  { value: "transport", label: "Transport & Logistics" },
  { value: "technology", label: "Technology & IT" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education & Training" },
  { value: "financial-services", label: "Financial Services" },
  { value: "real-estate", label: "Real Estate" },
  { value: "professional-services", label: "Professional Services" },
  { value: "automotive", label: "Automotive" },
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "mining", label: "Mining & Quarrying" },
  { value: "other", label: "Other" },
];

export const businessIndustryOptions: SelectOption[] = [
  // Agriculture, forestry and fishing
  { value: "agriculture", label: "Agriculture & Farming" },
  { value: "forestry", label: "Forestry" },
  { value: "fishing", label: "Fishing & Aquaculture" },

  // Mining and quarrying
  { value: "mining-coal", label: "Coal Mining" },
  { value: "mining-metal", label: "Metal Ore Mining" },
  { value: "mining-other", label: "Other Mining" },

  // Manufacturing
  { value: "food-manufacturing", label: "Food Manufacturing" },
  { value: "beverage-manufacturing", label: "Beverage Manufacturing" },
  { value: "textile-manufacturing", label: "Textile Manufacturing" },
  { value: "clothing-manufacturing", label: "Clothing Manufacturing" },
  { value: "leather-manufacturing", label: "Leather Goods Manufacturing" },
  { value: "wood-manufacturing", label: "Wood Products Manufacturing" },
  { value: "paper-manufacturing", label: "Paper Manufacturing" },
  { value: "printing", label: "Printing & Publishing" },
  { value: "chemical-manufacturing", label: "Chemical Manufacturing" },
  { value: "pharmaceutical-manufacturing", label: "Pharmaceutical Manufacturing" },
  { value: "rubber-plastic-manufacturing", label: "Rubber & Plastic Manufacturing" },
  { value: "metal-manufacturing", label: "Metal Manufacturing" },
  { value: "electronics-manufacturing", label: "Electronics Manufacturing" },
  { value: "electrical-equipment", label: "Electrical Equipment Manufacturing" },
  { value: "machinery-manufacturing", label: "Machinery Manufacturing" },
  { value: "motor-vehicle-manufacturing", label: "Motor Vehicle Manufacturing" },
  { value: "furniture-manufacturing", label: "Furniture Manufacturing" },

  // Electricity, gas, steam
  { value: "electricity-supply", label: "Electricity Supply" },
  { value: "water-supply", label: "Water Supply & Sanitation" },

  // Construction
  { value: "construction-buildings", label: "Building Construction" },
  { value: "civil-engineering", label: "Civil Engineering" },
  { value: "construction-specialized", label: "Specialized Construction" },

  // Wholesale and retail trade
  { value: "motor-vehicle-sales", label: "Motor Vehicle Sales & Repair" },
  { value: "wholesale-trade", label: "Wholesale Trade" },
  { value: "retail-trade", label: "Retail Trade" },

  // Transportation and storage
  { value: "land-transport", label: "Land Transport" },
  { value: "water-transport", label: "Water Transport" },
  { value: "air-transport", label: "Air Transport" },
  { value: "warehousing", label: "Warehousing & Storage" },

  // Accommodation and food
  { value: "accommodation", label: "Accommodation Services" },
  { value: "food-service", label: "Food Service Activities" },

  // Information and communication
  { value: "publishing", label: "Publishing Activities" },
  { value: "broadcasting", label: "Broadcasting" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "it-services", label: "IT Services & Software" },
  { value: "information-services", label: "Information Services" },

  // Financial and insurance
  { value: "financial-services", label: "Financial Services" },
  { value: "insurance", label: "Insurance" },
  { value: "financial-auxiliary", label: "Financial Auxiliary Services" },

  // Real estate
  { value: "real-estate", label: "Real Estate Activities" },

  // Professional, scientific and technical
  { value: "legal-accounting", label: "Legal & Accounting Services" },
  { value: "consulting", label: "Management Consulting" },
  { value: "architecture-engineering", label: "Architecture & Engineering" },
  { value: "research-development", label: "Research & Development" },
  { value: "advertising", label: "Advertising & Marketing" },
  { value: "veterinary", label: "Veterinary Services" },

  // Administrative and support
  { value: "rental-leasing", label: "Rental & Leasing" },
  { value: "employment-services", label: "Employment Services" },
  { value: "travel-services", label: "Travel Agency Services" },
  { value: "security-services", label: "Security Services" },
  { value: "facilities-services", label: "Facilities Management" },
  { value: "office-support", label: "Office Support Services" },

  // Education
  { value: "education", label: "Education & Training" },

  // Health and social work
  { value: "healthcare", label: "Healthcare Services" },
  { value: "social-work", label: "Social Work Activities" },

  // Arts, entertainment and recreation
  { value: "arts-entertainment", label: "Arts & Entertainment" },
  { value: "gambling", label: "Gambling & Betting" },
  { value: "sports-recreation", label: "Sports & Recreation" },

  // Other service activities
  { value: "membership-organizations", label: "Membership Organizations" },
  { value: "repair-services", label: "Repair Services" },
  { value: "personal-services", label: "Personal Services" },

  // Other
  { value: "other", label: "Other" },
];
