import {User} from "./user.model";

export interface CustomerMetrics {
  total_customer: number;
  total_registered_customer: number;
  total_blocked_customer: number;
}

export enum CustomerAddressLabel {
  HOME = 'HOME',
  WORK = 'WORK',
  OTHER = 'OTHER'
}

export interface CustomerAddress {
  id: string;
  // label: 'HOME' | 'WORK' | 'OTHER';
  label: CustomerAddressLabel;
  address_line: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface CustomerPrescriptionSlip{
  id: string;
  file_relative_path: string;
  file_absolute_path: string;
  created_at: string;
}

export interface Customer {
  id: string;
  user: User;

  first_name: string;
  last_name: string;

  phone_country_code: string;
  phone_number: string;
  email: string;

  phone_verified: boolean;
  email_verified: boolean;

  gender: 'FEMALE' | 'MALE' | 'OTHER';
  date_of_birth: string;

  is_registered: boolean;

  addresses: CustomerAddress[];

  is_blocked: boolean;
  blocked_remark: string;

  metrics: {
    new_orders: number;
    in_progress_orders: number;
    total_orders: number;
    total_order_amount: number;
  }

  created_at: string;
  updated_at: string;
}
