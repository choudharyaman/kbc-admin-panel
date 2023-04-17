export interface BusinessInformation {
  business_name: string;
  business_address: string;
  business_drug_license: string;
}

export interface BusinessPolicies {
  tnc: string;
  privacy: string;
  refund: string;
}

export interface CustomerSupport {
  email_address: string;
  phone_number: string;
  whatsapp_number: string;
}

export interface GlobalSetting {
  customer_support: CustomerSupport;
  business_information: BusinessInformation;
  business_policies: BusinessPolicies;
}
