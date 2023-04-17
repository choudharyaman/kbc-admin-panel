export enum MobileAppBannerTargetLinkType {
  NONE = '',
  URL = 'URL',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT'
}

export interface MobileAppBannerMediaFile {
  id: string;
  file_id: string;
  file_relative_path: string;
  file_absolute_path: string;
  created_at: string;
}

export interface MobileAppBanner {
  id: string;

  banner: MobileAppBannerMediaFile;
  banner_absolute_path: string;
  sequence: number;

  target_link_type: MobileAppBannerTargetLinkType;
  target_link: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

interface _AlertMessage {
  title: string;
  content: string;
  icon: 'info' | 'warning';
  display_type: 'popup' | 'banner';
  is_active: boolean;
}

export interface AppCustomerAlertMessage {
  android_alert_message: _AlertMessage;
  ios_alert_message: _AlertMessage;
}
