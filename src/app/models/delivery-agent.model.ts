import {User} from './user.model';

export enum DeliveryAgentType {
  BY_SELF = 'BY_SELF',
  COURIER = 'COURIER'
}

export interface DeliveryPerson {
  id: string;
  user: User;

  delivery_person_code: string;
  profile_photo: string;
  first_name: string;
  last_name: string;

  phone_country_code: string;
  phone_number: string;
  email: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;

  avatar_absolute_url: string;
}

export interface CourierAgent {
  id: string;

  courier_agent_name: string;
  courier_agent_logo: string;
  courier_agent_website: string;
  courier_agent_tracking_url: string;

  logo_absolute_url: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}
