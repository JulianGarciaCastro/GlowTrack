/**
 * Application Constants
 */

export const APP_VERSION = '1.0.0';
export const APP_NAME = 'Glow Track';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds

// Authorization Configuration
export const DEFAULT_AUTHORIZATION_EXPIRY_HOURS = 24;
export const DEFAULT_MAX_USES = 1;

// Date Formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Colors
export const COLORS = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Entry Types
  treatment: '#8B5CF6',
  intervention: '#F59E0B',
  surgery: '#EF4444',
  
  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  white: '#FFFFFF',
  black: '#000000',
};

// Validation Rules
export const VALIDATION = {
  minPasswordLength: 8,
  maxTitleLength: 100,
  maxDescriptionLength: 1000,
  maxNotesLength: 500,
};

// Storage Keys (for SecureStore)
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  refreshToken: 'refresh_token',
  userId: 'user_id',
  userRole: 'user_role',
};
