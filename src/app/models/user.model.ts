export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  CLERK = 'CLERK',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR'
}

export enum UserLoginStatus {
  ATTEMPTED = 'ATTEMPTED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface User {
  id: string;
  username: string;

  role: UserRole

  is_staff: boolean;
  is_active: boolean;
  is_blocked: boolean;

  blocked_remark: string;

  created_at: string;
  updated_at: string;
}

export interface UserDevice {
  ip_address: string;
  app_version: string;
  os: string;
  os_version: string;
  app_channel: string;
  device: string;
}

export interface UserLoginActivities extends UserDevice{
  id: number;
  status: UserLoginStatus;
  created_at: string;
}

export interface UserActivities extends UserDevice{
  id: number;
  type: string;
  description: string;
  request_data: string;
  created_at: string;
}
