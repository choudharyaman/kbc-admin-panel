export const AppConfig = {
  APP_NAME: "Drug Mart",

  COLORS: {
    PRIMARY: '#3f51b5',
    ACCENT: '#ff4081',
    SECONDARY: '#6C757D',
    INFO: '#0DCAF0',
    SUCCESS: '#198754',
    DANGER: '#DC3545',
    WARNING: '#FFC107',
    LIGHT: '#F8F9FA',
    DARK: '#212529'
  },

  DURATIONS: {
    TOAST_DISPLAY_TIME_MS: 4*1000,
    POPUP_DISPLAY_TIME_MS: 5*1000,
    SEARCH_DEBOUNCE_TIME_MS: 400,
  },

  AUTH: {
    ACCESS_TOKEN_KEY: "kbc_auth_access_token",
    REFRESH_TOKEN_KEY: "kbc_auth_refresh_token",
    USER_KEY: "kbc_auth_user"
  },

  USER_ROLES: {
    CUSTOMER: "CUSTOMER",
    SUPER_ADMIN: "SUPER_ADMIN",
    CLERK: "CLERK",
    MANAGER: "MANAGER",
    DELIVERY: "DELIVERY"
  },

  PRODUCTS: {
    TYPE: {
      OTC: "OTC",
      DRUGS: "DRUGS"
    },
    PACKAGING: {
      TYPES: ["strip", "bottle", "jar"],
      INSIDE_CONTENT_UNITS: ["tablets", "capsule", "ml", "litre", "grams", "kilograms", "ounces"]
    }
  },

  ORDER_STATUS: {
    PLACED: "PLACED",
    CONFIRMED: "CONFIRMED",
    IN_TRANSIT: "IN_TRANSIT",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    DENIED: "DENIED"
  },

  PRODUCT_IMAGE: {
    FORMATS: ["png", "jpg", "jpeg", "gif"],
    FORMAT_CONTENT_TYPES: ["image/x-png", "image/gif", "image/jpeg", "image/pjpeg"],
    MAX_DIM: [1024, 1024],
    MAX_SIZE_B: 1048576,
    MAX_SIZE_MB: 1
  },

  PROFILE_AVATAR_IMAGE: {
    FORMATS: ["png", "jpg", "jpeg", "gif"],
    FORMAT_CONTENT_TYPES: ["image/x-png", "image/gif", "image/jpeg", "image/pjpeg"],
    MAX_DIM: [1024, 1024],
    MAX_SIZE_B: 1048576,
    MAX_SIZE_MB: 1
  },

  DELIVERY_AGENT_TYPES: {
    BY_SELF: "BY_SELF",
    COURIER: "COURIER"
  },

  DISCOUNT_TYPES: {
    ABSOLUTE: "ABSOLUTE",
    RELATIVE: "RELATIVE"
  },

  MOBILE_APPS: {
    BANNER: {
      TARGET_LINK_TYPES: ["NONE", "CATEGORY", "URL"],
      MAX_ALLOWED: 5,
      IMAGE: {
        FORMATS: ["png", "jpg", "jpeg", "gif"],
        FORMAT_CONTENT_TYPES: ["image/x-png", "image/gif", "image/jpeg", "image/pjpeg"],
        MAX_DIM: [1024, 512],
        MAX_SIZE_B: 1048576,
        MAX_SIZE_MB: 1
      }
    }
  },

  MOBILE_APP_ALERT_MESSAGE: {
    ICON_TYPE: ["info", "warning"],
    DISPLAY_TYPE: ["popup", "banner"]
  },

  PHONE_DIAL_CODES: [
    {
      code: '91',
      label: 'India (+91)'
    }
  ],

  PAGINATION: {
    PAGE_SIZE_OPTIONS: [25, 50, 100, 200],
    DEFAULT_PAGE_SIZE: 25
  },
}
