# Glow Track - Arquitectura Técnica

## Visión General

Glow Track es una aplicación móvil desarrollada con arquitectura **API-First**, donde toda la lógica de negocio reside en el backend y la aplicación móvil actúa como un cliente que consume servicios a través de un SDK TypeScript generado automáticamente.

## Principios de Diseño

### 1. API-First
- El contrato de API (OpenAPI/Swagger) es la fuente de verdad
- El SDK TypeScript se genera automáticamente desde el contrato
- La aplicación solo consume el SDK, nunca realiza llamadas HTTP directas

### 2. Separación de Responsabilidades
- **Backend**: Lógica de negocio, validaciones, persistencia
- **Frontend**: Presentación, navegación, experiencia de usuario
- **SDK**: Capa de comunicación entre frontend y backend

### 3. Seguridad por Capas
- Autenticación a nivel de sesión (JWT)
- Autorización temporal para operaciones específicas (Grants)
- Auditoría completa de todas las acciones sensibles

## Componentes Principales

### 1. SDK Wrapper (`src/sdk/api.ts`)

El wrapper del SDK gestiona:
- Configuración de headers (Authorization, X-Grant-Id)
- Manejo de errores centralizado
- Refresh automático de tokens
- Conversión de respuestas a tipos TypeScript

```typescript
class ApiClient {
  private authToken?: string;
  private grantId?: string;
  
  setAuthToken(token: string)
  setGrantId(grantId: string)
  
  // Métodos para cada endpoint
  async getPatientEntries(patientId: string)
  async createEntry(data: any)
  // ...
}
```

### 2. Sistema de Autenticación

#### AuthContext (`src/services/auth.tsx`)
- Gestiona el estado de autenticación global
- Proporciona funciones de login/logout
- Mantiene información del usuario actual

#### SecureStorage
- Almacena tokens de forma segura usando Expo SecureStore
- Encriptación nativa del dispositivo
- Nunca almacena contraseñas

### 3. Sistema de Autorizaciones

Las autorizaciones permiten a pacientes dar acceso temporal a profesionales:

```
Paciente                    Profesional
   │                            │
   │  Genera Authorization      │
   │  (QR/Link + Token)         │
   │──────────────────────────> │
   │                            │
   │                            │  Escanea QR
   │                            │  Valida Token
   │  <────────────────────────│
   │  Código 2FA (opcional)     │
   │──────────────────────────> │
   │                            │
   │                            │  Usa Grant
   │                            │  Crea Entry
   │  <────────────────────────│
```

#### Flujo de Autorización

1. **Creación**: Paciente genera token con permisos específicos
2. **Distribución**: QR o enlace compartido con profesional
3. **Validación**: Backend verifica token y 2FA (si aplica)
4. **Uso**: Profesional usa Grant ID en header X-Grant-Id
5. **Auditoría**: Todas las acciones se registran

### 4. Modelos de Datos

#### Jerarquía de Tipos
```
User
├── Patient
│   ├── Entry[]
│   └── Authorization[]
└── Professional
    ├── Entry[]
    └── Center

Entry
├── Medication[]
├── Device[]
├── beforePhotos[]
└── afterPhotos[]
```

#### Relaciones Clave
- Un Entry pertenece a un Patient
- Un Entry es creado por un Professional
- Un Entry se realiza en un Center
- Un Entry puede tener múltiples Medications y Devices

### 5. Navegación

#### Estructura de Navegación
```
NavigationContainer
│
├── AuthStack (no autenticado)
│   └── LoginScreen
│
├── PatientStack (role: PATIENT)
│   └── PatientTabs
│       ├── CalendarScreen
│       ├── HistoryScreen
│       ├── ShareScreen
│       └── ProfileScreen
│
└── ProfessionalStack (role: PROFESSIONAL)
    └── ProfessionalTabs
        ├── EntriesScreen
        ├── NewEntryScreen
        └── ProfileScreen
```

## Flujos de Datos

### 1. Autenticación
```
LoginScreen
    ↓
useAuth().login(email, password)
    ↓
apiClient.login(email, password)
    ↓
Backend API
    ↓
{ token, refreshToken, user }
    ↓
SecureStorage.saveAuthToken(token)
    ↓
apiClient.setAuthToken(token)
    ↓
AuthContext actualiza user
    ↓
Navigation redirige según role
```

### 2. Creación de Entrada (con Autorización)
```
PatientShareScreen
    ↓
createAuthorization({ permissions, expiry })
    ↓
Backend genera Authorization + Token
    ↓
PatientShareScreen muestra QR
    ↓
ProfessionalNewEntryScreen escanea QR
    ↓
validateAuthorization(token, 2faCode?)
    ↓
Backend valida y retorna Authorization
    ↓
apiClient.setGrantId(token)
    ↓
createEntry(data) con header X-Grant-Id
    ↓
Backend verifica Grant y crea Entry
    ↓
Entry guardado y vinculado al Patient
```

### 3. Visualización de Calendario
```
CalendarScreen
    ↓
getPatientEntries(patientId, { startDate, endDate })
    ↓
Backend retorna Entry[]
    ↓
Transformación a CalendarEntry[]
    ↓
MonthCalendar renderiza con colores/iconos
```

## Seguridad

### 1. Autenticación
- JWT tokens con expiración
- Refresh tokens para renovación
- Logout invalida tokens en backend

### 2. Autorización
- Permisos granulares por Authorization
- Tokens de un solo uso o múltiples usos limitados
- Expiración temporal configurable
- 2FA opcional para mayor seguridad

### 3. Comunicación
- HTTPS obligatorio
- Headers seguros (Authorization, X-Grant-Id)
- CORS configurado en backend

### 4. Almacenamiento
- SecureStore para credenciales
- Encriptación nativa del dispositivo
- Nunca almacenar datos sensibles sin encriptar

### 5. Auditoría
```typescript
interface AuditLog {
  action: AuditAction;
  userId: string;
  userRole: UserRole;
  targetResourceId?: string;
  ipAddress: string;
  userAgent: string;
  grantId?: string;
  createdAt: Date;
}
```

Todas las acciones sensibles se registran:
- Login/Logout
- Creación/Revocación de autorizaciones
- Creación/Modificación de entradas
- Visualización de fotos
- Exportación de historial

## Escalabilidad

### Horizontal
- Backend API stateless
- Tokens JWT auto-contenidos
- Caché en cliente para datos frecuentes

### Vertical
- Paginación en listados largos
- Lazy loading de imágenes
- Virtualización de listas (FlatList)

## Performance

### Optimizaciones Clave
1. **Memoización**: Componentes con React.memo
2. **Lazy Loading**: Carga diferida de pantallas
3. **Caché**: Almacenamiento temporal de datos no sensibles
4. **Compresión**: Imágenes optimizadas automáticamente
5. **Batch Updates**: Agrupación de actualizaciones de estado

### Métricas Objetivo
- Time to Interactive: < 3s
- API Response Time: < 500ms
- App Size: < 50MB
- Memory Usage: < 100MB

## Testing

### Estrategia de Testing
```
Unit Tests (60%)
├── Utils
├── Formatters
├── API Client
└── Business Logic

Integration Tests (30%)
├── API Calls
├── Authentication Flow
└── Authorization Flow

E2E Tests (10%)
├── Login
├── Create Entry
└── Share Authorization
```

### Herramientas
- Jest: Unit & Integration tests
- React Native Testing Library: Component tests
- Detox: E2E tests (opcional)

## Deployment

### Build Pipeline
```
Code Push
    ↓
CI/CD (GitHub Actions)
    ↓
Tests
    ↓
EAS Build
    ↓
TestFlight / Internal Testing
    ↓
Review
    ↓
Production Release
```

### Ambientes
1. **Development**: Local con backend de desarrollo
2. **Staging**: EAS con backend de staging
3. **Production**: App Stores con backend de producción

## Monitoreo

### Métricas Clave
- Crash Rate
- API Error Rate
- User Sessions
- Screen View Times
- Authorization Success Rate

### Herramientas Recomendadas
- Sentry: Error tracking
- Firebase Analytics: User analytics
- New Relic: Performance monitoring

## Mantenimiento

### Actualizaciones
- SDK: Regenerar cuando cambie OpenAPI spec
- Dependencies: Actualización mensual
- Security patches: Inmediato

### Versionado
- Semantic Versioning (MAJOR.MINOR.PATCH)
- Changelog actualizado en cada release
- Migrations documentadas

---

**Última actualización**: Octubre 2025
