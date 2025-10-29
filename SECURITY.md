# Glow Track - Documento de Seguridad

## Resumen Ejecutivo

Este documento describe las medidas de seguridad implementadas en Glow Track para proteger los datos sensibles de pacientes y profesionales de medicina estética.

## Clasificación de Datos

### Datos Altamente Sensibles
- Información médica de tratamientos
- Fotografías antes/después
- Medicamentos y dosis administradas
- Historial clínico completo
- Tokens de autenticación

### Datos Sensibles
- Información personal (nombre, email, teléfono)
- Número de licencia profesional
- Información de centros médicos

### Datos Públicos
- Nombres de tratamientos genéricos
- Tipos de dispositivos (sin serial numbers)

## Autenticación y Autorización

### 1. Sistema de Autenticación

#### JWT Tokens
```typescript
{
  "iss": "glowtrack-api",
  "sub": "user-id",
  "role": "PATIENT|PROFESSIONAL",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Características**:
- Expiración: 1 hora
- Refresh token: 30 días
- Almacenamiento: Expo SecureStore (encriptado)
- Transmisión: Header Authorization: Bearer <token>

#### Proceso de Login
1. Usuario ingresa credenciales
2. Backend valida y genera JWT + Refresh Token
3. Tokens se almacenan en SecureStore
4. JWT se incluye en todas las peticiones
5. Al expirar, refresh token renueva JWT automáticamente

### 2. Sistema de Autorización Temporal

#### Grants (Autorizaciones)
Permiten a pacientes dar acceso temporal a profesionales para operaciones específicas.

```typescript
interface Authorization {
  token: string;           // Token único de un solo uso o múltiples usos
  expiresAt: Date;         // Expiración temporal
  maxUses: number;         // Límite de usos
  requires2FA: boolean;    // Requiere verificación adicional
  permissions: {
    canCreateEntry: boolean;
    canViewHistory: boolean;
    canUploadPhotos: boolean;
  };
}
```

#### Flujo de Autorización

**Paso 1: Creación**
```typescript
// Paciente crea autorización
POST /patients/{id}/authorizations
{
  "type": "QR_CODE",
  "expiresInHours": 24,
  "maxUses": 1,
  "requires2FA": true,
  "permissions": {
    "canCreateEntry": true,
    "canViewHistory": false,
    "canUploadPhotos": true
  }
}

// Response
{
  "id": "auth-123",
  "token": "glowtrack_grant_abc123xyz",
  "twoFactorCode": "123456",
  "expiresAt": "2025-10-30T12:00:00Z",
  "status": "ACTIVE"
}
```

**Paso 2: Validación**
```typescript
// Profesional valida token
POST /authorizations/validate
{
  "token": "glowtrack_grant_abc123xyz",
  "twoFactorCode": "123456"
}

// Response
{
  "valid": true,
  "authorization": { ... },
  "patient": { ... }
}
```

**Paso 3: Uso**
```typescript
// Profesional usa grant para crear entrada
POST /entries
Headers:
  Authorization: Bearer {professional_jwt}
  X-Grant-Id: glowtrack_grant_abc123xyz
Body: { ... entry data ... }
```

**Paso 4: Auditoría**
```typescript
// Cada uso se registra
{
  "action": "ENTRY_CREATED",
  "userId": "professional-id",
  "targetUserId": "patient-id",
  "grantId": "auth-123",
  "ipAddress": "192.168.1.1",
  "createdAt": "2025-10-29T10:30:00Z"
}
```

### 3. Verificación en Dos Pasos (2FA)

Cuando una autorización requiere 2FA:

1. Backend genera código de 6 dígitos
2. Paciente recibe código (mostrado en QR)
3. Profesional solicita código al paciente
4. Profesional ingresa código en app
5. Backend valida código
6. Acceso concedido

**Características de Seguridad**:
- Código expira con la autorización
- Un código por autorización
- Máximo 3 intentos fallidos
- Bloqueo temporal tras intentos fallidos

## Almacenamiento Seguro

### Expo SecureStore

```typescript
// ✅ CORRECTO - Usar SecureStore para datos sensibles
await SecureStore.setItemAsync('auth_token', token);
await SecureStore.setItemAsync('refresh_token', refreshToken);

// ❌ INCORRECTO - Nunca usar AsyncStorage para datos sensibles
await AsyncStorage.setItem('auth_token', token); // NUNCA HACER ESTO
```

**Garantías de SecureStore**:
- iOS: Keychain Services
- Android: EncryptedSharedPreferences / Keystore
- Encriptación a nivel de sistema operativo
- Protección contra acceso no autorizado
- Eliminación segura en desinstalación

### Datos en Memoria

**Buenas Prácticas**:
```typescript
// ✅ Limpiar datos sensibles tras uso
apiClient.clearGrantId();

// ✅ No almacenar contraseñas
// Nunca guardar password en estado o storage

// ✅ Sanitizar logs
console.log('User logged in', { userId: user.id }); // OK
console.log('Login data', { email, password }); // NUNCA
```

## Comunicación Segura

### 1. HTTPS Obligatorio

```typescript
// Configuración del API Client
const API_BASE_URL = 'https://api.glowtrack.com'; // HTTPS obligatorio
```

**Validaciones**:
- Certificado SSL válido
- TLS 1.2 o superior
- Perfect Forward Secrecy (PFS)
- HTTP Strict Transport Security (HSTS)

### 2. Headers de Seguridad

```typescript
// Headers enviados en cada petición
{
  "Authorization": "Bearer eyJhbGc...",
  "X-Grant-Id": "glowtrack_grant_abc123", // Si aplica
  "Content-Type": "application/json",
  "X-App-Version": "1.0.0",
  "X-Platform": "ios|android"
}
```

### 3. Validación de Respuestas

```typescript
// Siempre validar respuestas del backend
if (!response.ok) {
  // No exponer detalles del error al usuario
  console.error('API Error', response.error);
  Alert.alert('Error', 'Ocurrió un error. Por favor intenta nuevamente.');
}
```

## Auditoría y Logging

### Eventos Auditados

```typescript
enum AuditAction {
  // Autenticación
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  
  // Autorizaciones
  AUTHORIZATION_CREATED = 'AUTHORIZATION_CREATED',
  AUTHORIZATION_USED = 'AUTHORIZATION_USED',
  AUTHORIZATION_REVOKED = 'AUTHORIZATION_REVOKED',
  AUTHORIZATION_EXPIRED = 'AUTHORIZATION_EXPIRED',
  
  // Entradas
  ENTRY_CREATED = 'ENTRY_CREATED',
  ENTRY_UPDATED = 'ENTRY_UPDATED',
  ENTRY_DELETED = 'ENTRY_DELETED',
  ENTRY_VIEWED = 'ENTRY_VIEWED',
  
  // Datos sensibles
  PHOTO_UPLOADED = 'PHOTO_UPLOADED',
  PHOTO_VIEWED = 'PHOTO_VIEWED',
  HISTORY_EXPORTED = 'HISTORY_EXPORTED',
  
  // Seguridad
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TWO_FACTOR_FAILED = 'TWO_FACTOR_FAILED',
}
```

### Información Registrada

```typescript
interface AuditLog {
  id: string;
  action: AuditAction;
  userId: string;
  userRole: UserRole;
  targetUserId?: string;
  targetResourceId?: string;
  ipAddress: string;
  userAgent: string;
  grantId?: string;
  success: boolean;
  errorCode?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}
```

**Retención**:
- Logs de auditoría: 7 años (cumplimiento legal)
- Logs técnicos: 90 días
- Acceso restringido a administradores

## Gestión de Permisos

### Permisos iOS (Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para escanear códigos QR de autorización.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceso a tus fotos para subir imágenes de tratamientos (solo con tu autorización).</string>

<key>NSFaceIDUsageDescription</key>
<string>Usa Face ID para acceso rápido y seguro a la aplicación.</string>
```

### Permisos Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
```

**Principio de Mínimo Privilegio**:
- Solo solicitar permisos necesarios
- Solicitar en el momento de uso
- Explicar claramente el uso del permiso

## Manejo de Errores

### No Exponer Información Sensible

```typescript
// ❌ INCORRECTO
catch (error) {
  Alert.alert('Error', error.message); // Puede exponer detalles técnicos
}

// ✅ CORRECTO
catch (error) {
  console.error('Error detail', error); // Solo en logs internos
  Alert.alert(
    'Error',
    'No se pudo completar la operación. Por favor intenta nuevamente.'
  );
}
```

### Códigos de Error

```typescript
// Usar códigos de error genéricos para usuarios
enum UserErrorCode {
  NETWORK_ERROR = 'No se pudo conectar. Verifica tu conexión.',
  UNAUTHORIZED = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  FORBIDDEN = 'No tienes permisos para realizar esta acción.',
  NOT_FOUND = 'No se encontró el recurso solicitado.',
  VALIDATION_ERROR = 'Por favor verifica los datos ingresados.',
  SERVER_ERROR = 'Ocurrió un error. Por favor intenta nuevamente.',
}
```

## Checklist de Seguridad

### Desarrollo
- [ ] Usar HTTPS en todas las comunicaciones
- [ ] Almacenar credenciales solo en SecureStore
- [ ] Nunca almacenar contraseñas
- [ ] Implementar timeout de sesión
- [ ] Validar todas las entradas de usuario
- [ ] Sanitizar logs (sin datos sensibles)
- [ ] Usar permisos mínimos necesarios

### Pre-Producción
- [ ] Audit logs implementados y funcionando
- [ ] 2FA testeado exhaustivamente
- [ ] Autorización temporal validada
- [ ] Tokens expiran correctamente
- [ ] Refresh token funciona
- [ ] Error handling no expone información sensible
- [ ] Permisos de OS correctamente configurados

### Producción
- [ ] Monitoreo de eventos de seguridad
- [ ] Alertas de accesos no autorizados
- [ ] Backup de audit logs
- [ ] Plan de respuesta a incidentes
- [ ] Revisión periódica de logs
- [ ] Actualización de dependencias de seguridad

## Reporte de Vulnerabilidades

Si descubres una vulnerabilidad de seguridad, por favor repórtala a:

**Email**: security@glowtrack.com

**Proceso**:
1. Enviar descripción detallada (sin divulgación pública)
2. Equipo de seguridad investiga (< 48 horas)
3. Se desarrolla fix si es necesario
4. Se notifica al reportero
5. Se publica fix
6. Reconocimiento público (si se desea)

**NO**:
- No divulgues públicamente antes de que se publique el fix
- No explotes la vulnerabilidad en producción

## Cumplimiento Legal

### GDPR (Europa)
- Derecho al olvido implementado
- Exportación de datos personales
- Consentimiento explícito para datos sensibles
- Notificación de brechas de seguridad (< 72 horas)

### LOPD (España)
- Cumplimiento de Ley Orgánica de Protección de Datos
- Registro de actividades de tratamiento
- Medidas técnicas y organizativas apropiadas

### HIPAA Considerations
- Aunque no es una app puramente médica, se aplican mejores prácticas
- Encriptación de datos en tránsito y reposo
- Audit logs completos
- Control de acceso granular

---

**Última actualización**: Octubre 2025
**Próxima revisión**: Enero 2026
