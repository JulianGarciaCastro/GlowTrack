/**
 * Glow Track - Type Definitions
 * Core data models for the patient-centric aesthetic treatment tracking system
 */

// ============================================================================
// User Types
// ============================================================================

export enum UserRole {
  PATIENT = 'PATIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  CENTER_ADMIN = 'CENTER_ADMIN',
}

export interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professional {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string; // Número de colegiado
  licenseAuthority: string; // Autoridad que emite la licencia
  phoneNumber?: string;
  profilePicture?: string;
  centerId?: string; // Centro principal de trabajo
  createdAt: Date;
  updatedAt: Date;
}

export interface Center {
  id: string;
  name: string;
  registrationNumber: string; // Identificación legal del centro
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
  logoUrl?: string;
  licenseType: string; // Tipo de licencia sanitaria
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Entry Types (Tratamientos/Intervenciones)
// ============================================================================

export enum EntryType {
  TREATMENT = 'TREATMENT', // Tratamiento ambulatorio
  INTERVENTION = 'INTERVENTION', // Intervención menor
  SURGERY = 'SURGERY', // Cirugía
}

export enum EntryStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface Entry {
  id: string;
  patientId: string;
  type: EntryType;
  status: EntryStatus;
  title: string;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  duration?: number; // Duración en minutos
  
  // Relaciones
  professionalId: string;
  professional?: Professional;
  centerId: string;
  center?: Center;
  medications: Medication[];
  devices: Device[];
  
  // Datos clínicos
  notes?: string;
  followUpDate?: Date;
  beforePhotos?: string[];
  afterPhotos?: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // ID del profesional que creó la entrada
}

// ============================================================================
// Medical Details
// ============================================================================

export interface Medication {
  id: string;
  entryId: string;
  name: string;
  activeIngredient?: string;
  brandName?: string;
  dose: string;
  unit: string; // ml, mg, unidades, etc.
  manufacturer?: string;
  batchNumber?: string;
  expirationDate?: Date;
  administrationRoute: string; // Intramuscular, subcutánea, tópica, etc.
  administeredBy: string; // ID del profesional
  notes?: string;
  createdAt: Date;
}

export interface Device {
  id: string;
  entryId: string;
  name: string;
  type: string; // Láser, radiofrecuencia, ultrasonido, etc.
  manufacturer: string;
  model: string;
  serialNumber?: string;
  settings?: DeviceSettings;
  operatedBy: string; // ID del profesional
  duration?: number; // Duración de uso en minutos
  notes?: string;
  createdAt: Date;
}

export interface DeviceSettings {
  power?: string;
  frequency?: string;
  intensity?: string;
  temperature?: string;
  pulses?: number;
  [key: string]: any; // Configuraciones adicionales específicas del dispositivo
}

// ============================================================================
// Authorization System
// ============================================================================

export enum AuthorizationType {
  QR_CODE = 'QR_CODE',
  LINK = 'LINK',
}

export enum AuthorizationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

export interface Authorization {
  id: string;
  patientId: string;
  type: AuthorizationType;
  status: AuthorizationStatus;
  
  // Token de autorización (un solo uso)
  token: string;
  
  // Configuración
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
  
  // Profesional autorizado
  professionalId?: string; // Si se especifica, solo este profesional puede usar
  centerId?: string; // Si se especifica, solo desde este centro
  
  // 2FA
  requires2FA: boolean;
  twoFactorCode?: string;
  twoFactorVerifiedAt?: Date;
  
  // Permisos específicos
  permissions: AuthorizationPermissions;
  
  // Auditoría
  createdAt: Date;
  usedAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
}

export interface AuthorizationPermissions {
  canCreateEntry: boolean;
  canViewHistory: boolean;
  canUploadPhotos: boolean;
  entryTypes: EntryType[]; // Tipos de entrada permitidos
}

// ============================================================================
// Audit Log
// ============================================================================

export enum AuditAction {
  // Autenticación
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  
  // Autorizaciones
  AUTHORIZATION_CREATED = 'AUTHORIZATION_CREATED',
  AUTHORIZATION_USED = 'AUTHORIZATION_USED',
  AUTHORIZATION_REVOKED = 'AUTHORIZATION_REVOKED',
  
  // Entradas
  ENTRY_CREATED = 'ENTRY_CREATED',
  ENTRY_UPDATED = 'ENTRY_UPDATED',
  ENTRY_DELETED = 'ENTRY_DELETED',
  ENTRY_VIEWED = 'ENTRY_VIEWED',
  
  // Datos sensibles
  PHOTO_UPLOADED = 'PHOTO_UPLOADED',
  PHOTO_VIEWED = 'PHOTO_VIEWED',
  HISTORY_EXPORTED = 'HISTORY_EXPORTED',
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  userId: string;
  userRole: UserRole;
  
  // Contexto
  targetUserId?: string; // Usuario afectado (ej: paciente)
  targetResourceId?: string; // ID del recurso afectado
  targetResourceType?: string; // Tipo de recurso (Entry, Authorization, etc.)
  
  // Detalles
  details?: Record<string, any>;
  
  // Metadata de seguridad
  ipAddress: string;
  userAgent: string;
  grantId?: string; // ID de autorización si aplica
  
  createdAt: Date;
}

// ============================================================================
// API & SDK Types
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  authToken?: string;
  grantId?: string; // Para operaciones con autorización temporal
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface CalendarEntry {
  id: string;
  date: Date;
  type: EntryType;
  status: EntryStatus;
  title: string;
  color: string; // Color asociado al tipo
  icon: string; // Nombre del icono
}

export interface MonthData {
  year: number;
  month: number;
  entries: CalendarEntry[];
}

// ============================================================================
// Form Types
// ============================================================================

export interface CreateEntryForm {
  type: EntryType;
  title: string;
  description: string;
  scheduledDate: Date;
  duration?: number;
  centerId: string;
  professionalId: string;
  notes?: string;
  followUpDate?: Date;
}

export interface AddMedicationForm {
  name: string;
  activeIngredient?: string;
  brandName?: string;
  dose: string;
  unit: string;
  manufacturer?: string;
  batchNumber?: string;
  expirationDate?: Date;
  administrationRoute: string;
  notes?: string;
}

export interface AddDeviceForm {
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  settings?: DeviceSettings;
  duration?: number;
  notes?: string;
}

export interface CreateAuthorizationForm {
  type: AuthorizationType;
  expiresInHours: number;
  maxUses: number;
  professionalId?: string;
  centerId?: string;
  requires2FA: boolean;
  permissions: AuthorizationPermissions;
}
