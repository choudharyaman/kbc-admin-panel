import {User, UserRole} from './user.model';

export interface Staff {
  id: string;
  user: User;

  employee_code: string;

  first_name: string;
  last_name: string;

  email: string;

  phone_country_code: string;
  phone_number: string;

  role: UserRole;

  created_at: string;
  updated_at: string;
}
