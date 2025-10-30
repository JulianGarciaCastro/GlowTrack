/**
 * Utility functions for formatting data
 */

import { format, formatDistance, formatRelative } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string, formatStr: string = "d 'de' MMMM, yyyy"): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: es });
};

/**
 * Format a date as relative time (e.g., "hace 2 días")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es });
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Simple formatter for Spanish phone numbers
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phoneNumber;
};

/**
 * Format professional license number
 */
export const formatLicenseNumber = (licenseNumber: string): string => {
  return licenseNumber.toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format duration in minutes to hours and minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${mins} min`;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format entry type to readable string
 */
export const formatEntryType = (type: string): string => {
  switch (type) {
    case 'TREATMENT':
      return 'Tratamiento';
    case 'INTERVENTION':
      return 'Intervención';
    case 'SURGERY':
      return 'Cirugía';
    default:
      return type;
  }
};

/**
 * Format entry status to readable string
 */
export const formatEntryStatus = (status: string): string => {
  switch (status) {
    case 'SCHEDULED':
      return 'Programado';
    case 'COMPLETED':
      return 'Completado';
    case 'IN_PROGRESS':
      return 'En curso';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
};
