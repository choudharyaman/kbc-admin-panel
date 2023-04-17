import {UserRole} from './user.model';

export interface Profile {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  phone_country_code: string;
  phone_number: string;
  email: string;
  role: UserRole;

  created_at: string;
  updated_at: string;
}
