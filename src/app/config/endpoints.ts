import {environment} from '../../environments/environment';

const API_BASE_URL = `${environment.apiBaseUrl}/admin`;

export const Endpoints = {
  AUTH_LOGIN: API_BASE_URL + "/v1/auth/login",
  AUTH_REFRESH_TOKEN: API_BASE_URL + "/v1/auth/refresh",
  AUTH_LOGOUT: API_BASE_URL + "/v1/auth/logout",
  AUTH_PROFILE: API_BASE_URL + "/v1/auth/profile",
  AUTH_CHANGE_PASSWORD: API_BASE_URL + "/v1/auth/change-password",
  AUTH_RESET_PASSWORD: API_BASE_URL + "/v1/auth/forgot-password/send-otp",
  AUTH_RESET_PASSWORD_SET_PASSWORD: API_BASE_URL + "/v1/auth/forgot-password/set-password",
  AUTH_USER_ACTIVITIES: API_BASE_URL + "/v1/auth/user-activities",
  AUTH_LOGIN_ACTIVITIES: API_BASE_URL + "/v1/auth/login-activities",
  ORDER_METRICS: API_BASE_URL + "/v1/orders/metrics",
  ORDERS: API_BASE_URL + "/v1/orders",
  ORDER_ITEMS: API_BASE_URL + "/v1/orders/:orderId/order-items",
  ORDER_DELIVERIES: API_BASE_URL + "/v1/orders/:orderId/order-deliveries",
  PRODUCT_CATEGORIES: API_BASE_URL + "/v1/product-categories",
  PRODUCTS: API_BASE_URL + "/v1/products",
  CATEGORY_LINKED_PRODUCTS: API_BASE_URL + "/v1/product-categories/:productCategoryId/products",
  PRODUCT_METRICS: API_BASE_URL + "/v1/products/metrics",
  CUSTOMER_METRICS: API_BASE_URL + "/v1/customers/metrics",
  CUSTOMERS: API_BASE_URL + "/v1/customers",
  CUSTOMER_ORDERS: API_BASE_URL + "/v1/customers/:customerId/orders",
  DELIVERY_PERSONS: API_BASE_URL + "/v1/delivery-persons",
  COURIER_AGENTS: API_BASE_URL + "/v1/courier-agents",
  TAXES: API_BASE_URL + "/v1/taxes",
  DISCOUNTS: API_BASE_URL + "/v1/discounts",
  STAFF: API_BASE_URL + "/v1/staff",
  USERS: API_BASE_URL + "/v1/users",
  USER_ACTIVITIES: API_BASE_URL + "/v1/users/:userId/activities",
  USER_LOGIN_ACTIVITIES: API_BASE_URL + "/v1/users/:userId/login-activities",
  MOBILE_APP_BANNERS: API_BASE_URL + "/v1/mobile-apps/banners",
  MOBILE_APP_BANNER_FILES: API_BASE_URL + "/v1/mobile-apps/banners/files",
  MOBILE_APP_CUSTOMER_ALERT_MESSAGE: API_BASE_URL + "/v1/mobile-apps/alert-message",
  MOBILE_APP_CUSTOMER_GLOBAL_SETTINGS: API_BASE_URL + "/v1/mobile-apps/global-settings",
  GLOBAL_SETTINGS: API_BASE_URL + "/v1/global-settings",
  UPLOAD_PRODUCT_IMAGE: API_BASE_URL + "/v1/upload/product-images",
  UPLOAD_PROFILE_AVATARS: API_BASE_URL + "/v1/upload/profile-avatar",
  UPLOAD_MOBILE_APP_BANNER: API_BASE_URL + "/v1/upload/mobile-app-banner"
}
