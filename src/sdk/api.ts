/**
 * Glow Track SDK Wrapper
 * 
 * This module wraps the auto-generated TypeScript SDK (from OpenAPI/typescript-fetch)
 * and provides authentication, authorization headers, and error handling.
 */

import * as SecureStore from 'expo-secure-store';
import { ApiConfig, ApiResponse, ApiError } from '../types';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.glowtrack.com';
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ============================================================================
// SDK Configuration Class
// ============================================================================

export class ApiClient {
  private baseUrl: string;
  private authToken?: string;
  private grantId?: string;

  constructor(config?: Partial<ApiConfig>) {
    this.baseUrl = config?.baseUrl || API_BASE_URL;
    this.authToken = config?.authToken;
    this.grantId = config?.grantId;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Set grant ID for temporary authorization operations
   */
  setGrantId(grantId: string) {
    this.grantId = grantId;
  }

  /**
   * Clear grant ID
   */
  clearGrantId() {
    this.grantId = undefined;
  }

  /**
   * Get common headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (this.grantId) {
      headers['X-Grant-Id'] = this.grantId;
    }

    return headers;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || 'UNKNOWN_ERROR',
            message: data.message || 'An error occurred',
            details: data.details,
          },
        };
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }

  // =========================================================================
  // Authentication Methods
  // =========================================================================

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // =========================================================================
  // Patient Methods
  // =========================================================================

  async getPatientProfile(patientId: string) {
    return this.request(`/patients/${patientId}`, {
      method: 'GET',
    });
  }

  async updatePatientProfile(patientId: string, data: any) {
    return this.request(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // =========================================================================
  // Professional Methods
  // =========================================================================

  async getProfessionalProfile(professionalId: string) {
    return this.request(`/professionals/${professionalId}`, {
      method: 'GET',
    });
  }

  async updateProfessionalProfile(professionalId: string, data: any) {
    return this.request(`/professionals/${professionalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getProfessionalEntries(professionalId: string) {
    return this.request(`/professionals/${professionalId}/entries`, {
      method: 'GET',
    });
  }

  // =========================================================================
  // Center Methods
  // =========================================================================

  async getCenter(centerId: string) {
    return this.request(`/centers/${centerId}`, {
      method: 'GET',
    });
  }

  async createCenter(data: any) {
    return this.request('/centers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCenter(centerId: string, data: any) {
    return this.request(`/centers/${centerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // =========================================================================
  // Entry Methods
  // =========================================================================

  async getPatientEntries(patientId: string, params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
  }) {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request(`/patients/${patientId}/entries${queryString}`, {
      method: 'GET',
    });
  }

  async getEntry(entryId: string) {
    return this.request(`/entries/${entryId}`, {
      method: 'GET',
    });
  }

  async createEntry(data: any) {
    return this.request('/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntry(entryId: string, data: any) {
    return this.request(`/entries/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(entryId: string) {
    return this.request(`/entries/${entryId}`, {
      method: 'DELETE',
    });
  }

  // =========================================================================
  // Medication Methods
  // =========================================================================

  async addMedication(entryId: string, data: any) {
    return this.request(`/entries/${entryId}/medications`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMedication(medicationId: string, data: any) {
    return this.request(`/medications/${medicationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMedication(medicationId: string) {
    return this.request(`/medications/${medicationId}`, {
      method: 'DELETE',
    });
  }

  // =========================================================================
  // Device Methods
  // =========================================================================

  async addDevice(entryId: string, data: any) {
    return this.request(`/entries/${entryId}/devices`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDevice(deviceId: string, data: any) {
    return this.request(`/devices/${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDevice(deviceId: string) {
    return this.request(`/devices/${deviceId}`, {
      method: 'DELETE',
    });
  }

  // =========================================================================
  // Authorization Methods
  // =========================================================================

  async createAuthorization(patientId: string, data: any) {
    return this.request(`/patients/${patientId}/authorizations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAuthorizations(patientId: string) {
    return this.request(`/patients/${patientId}/authorizations`, {
      method: 'GET',
    });
  }

  async revokeAuthorization(authorizationId: string) {
    return this.request(`/authorizations/${authorizationId}/revoke`, {
      method: 'POST',
    });
  }

  async validateAuthorization(token: string, twoFactorCode?: string) {
    return this.request('/authorizations/validate', {
      method: 'POST',
      body: JSON.stringify({ token, twoFactorCode }),
    });
  }

  async useAuthorization(token: string) {
    return this.request('/authorizations/use', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // =========================================================================
  // Audit Log Methods
  // =========================================================================

  async getAuditLogs(params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    action?: string;
  }) {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request(`/audit-logs${queryString}`, {
      method: 'GET',
    });
  }

  // =========================================================================
  // File Upload Methods
  // =========================================================================

  async uploadPhoto(entryId: string, photoUri: string, type: 'before' | 'after') {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: `${type}_photo.jpg`,
    } as any);
    formData.append('type', type);

    return this.request(`/entries/${entryId}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData as any,
    });
  }
}

// ============================================================================
// Secure Storage Helpers
// ============================================================================

export class SecureStorage {
  static async saveAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  }

  static async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  }

  static async removeAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  }

  static async saveRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  static async removeRefreshToken(): Promise<void> {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }

  static async clearAll(): Promise<void> {
    await Promise.all([
      this.removeAuthToken(),
      this.removeRefreshToken(),
    ]);
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const apiClient = new ApiClient();

export default apiClient;
