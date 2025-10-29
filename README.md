# Glow Track - API-First Patient Treatment Tracking App

![Glow Track](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.73-blue)
![Expo](https://img.shields.io/badge/Expo-50.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

**Glow Track** es una aplicación móvil centrada en el paciente para gestionar su calendario de intervenciones, cirugías y tratamientos de medicina estética. Desarrollada con arquitectura API-first usando React Native y Expo.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Uso](#-uso)
- [Modelos de Datos](#-modelos-de-datos)
- [Seguridad](#-seguridad)
- [API](#-api)
- [Testing](#-testing)
- [Despliegue](#-despliegue)

## ✨ Características

### Para Pacientes
- 📅 **Calendario Visual**: Vista mensual tipo calendario menstrual con todos los tratamientos
- 📋 **Historial Completo**: Registro detallado de todas las intervenciones
- 🔗 **Sistema de Autorización**: Genera QR o enlaces con 2FA para compartir acceso
- 👤 **Perfil Personal**: Gestión de información personal y configuración

### Para Profesionales
- 💉 **Registro de Intervenciones**: Formularios completos para documentar tratamientos
- 💊 **Medicamentos y Aparatología**: Detalle exhaustivo de productos y dispositivos usados
- 🏥 **Gestión de Centro**: Información del centro médico
- 📊 **Historial de Intervenciones**: Consulta de todas las intervenciones realizadas

### Seguridad
- 🔐 **Autenticación Segura**: Sistema de login con tokens JWT
- 🔒 **Autorización 2FA**: Verificación en dos pasos para accesos temporales
- 📝 **Auditoría Completa**: Registro detallado de todas las acciones
- 🔑 **Tokens de un Solo Uso**: Autorización temporal con tokens revocables
- 💾 **Almacenamiento Seguro**: Uso de Expo SecureStore para datos sensibles

## 🏗 Arquitectura

### API-First Design
La aplicación consume exclusivamente un SDK TypeScript generado desde un contrato OpenAPI (especificación `typescript-fetch`). Toda la lógica de negocio reside en el backend.

```
┌─────────────────┐
│   React Native  │
│   (Expo App)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   SDK Wrapper   │  ← api.ts con headers Authorization y X-Grant-Id
│  (TypeScript)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│    (OpenAPI)    │
└─────────────────┘
```

### Tecnologías Principales
- **React Native**: Framework de desarrollo móvil multiplataforma
- **Expo**: Plataforma para desarrollo y despliegue
- **TypeScript**: Tipado estático para mayor seguridad
- **React Navigation**: Sistema de navegación
- **Zustand**: Gestión de estado (opcional)
- **date-fns**: Manipulación de fechas
- **Expo SecureStore**: Almacenamiento seguro de credenciales

## 📦 Requisitos

- Node.js 18.x o superior
- npm 9.x o yarn 1.22.x
- Expo CLI
- iOS Simulator (para desarrollo en Mac) o Android Studio (para desarrollo Android)
- Cuenta de Expo (para testing en dispositivos físicos)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/your-org/glow-track.git
cd glow-track
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_API_URL=https://api.glowtrack.com
```

### 4. Iniciar el servidor de desarrollo
```bash
npm start
# o
expo start
```

### 5. Ejecutar en dispositivo/simulador
- **iOS**: Presiona `i` en la terminal o escanea el QR con la app Expo Go
- **Android**: Presiona `a` en la terminal o escanea el QR con la app Expo Go
- **Web**: Presiona `w` en la terminal

## ⚙️ Configuración

### Configuración del SDK

El archivo `src/sdk/api.ts` contiene el wrapper del SDK. Para configurar:

```typescript
import { ApiClient } from './sdk/api';

// Crear instancia del cliente
const apiClient = new ApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
});

// Configurar token de autenticación
apiClient.setAuthToken('your-jwt-token');

// Configurar Grant ID para operaciones con autorización
apiClient.setGrantId('authorization-token');
```

### Configuración de Autenticación

El sistema de autenticación se gestiona a través de `AuthContext`:

```typescript
import { useAuth } from './services/auth';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  // Login
  await login('email@example.com', 'password');
  
  // Logout
  await logout();
}
```

## 📁 Estructura del Proyecto

```
glow-track/
├── App.tsx                      # Punto de entrada principal
├── app.json                     # Configuración de Expo
├── package.json                 # Dependencias
├── tsconfig.json                # Configuración TypeScript
├── babel.config.js              # Configuración Babel
│
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Calendar/
│   │   │   └── MonthCalendar.tsx
│   │   └── QRCode/
│   │       ├── QRGenerator.tsx
│   │       └── QRScanner.tsx
│   │
│   ├── screens/                 # Pantallas de la aplicación
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── patient/
│   │   │   ├── CalendarScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   ├── ShareScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── professional/
│   │       ├── EntriesScreen.tsx
│   │       └── NewEntryScreen.tsx
│   │
│   ├── navigation/              # Configuración de navegación
│   │   └── index.tsx
│   │
│   ├── services/                # Servicios y lógica de negocio
│   │   └── auth.tsx
│   │
│   ├── sdk/                     # SDK y wrapper de API
│   │   └── api.ts
│   │
│   ├── types/                   # Definiciones de tipos TypeScript
│   │   └── index.ts
│   │
│   └── utils/                   # Utilidades y helpers
│       ├── constants.ts
│       └── formatters.ts
│
└── assets/                      # Recursos estáticos
    ├── icon.png
    ├── splash.png
    └── adaptive-icon.png
```

## 🎯 Uso

### Flujo del Paciente

#### 1. Visualizar Calendario
```typescript
// El calendario muestra tratamientos con colores según tipo
- Morado: Tratamientos
- Ámbar: Intervenciones
- Rojo: Cirugías
```

#### 2. Generar Autorización
```typescript
// Desde la pantalla "Compartir"
1. Presionar "+ Nueva autorización"
2. Configurar permisos y duración
3. Habilitar 2FA (opcional)
4. Compartir QR o enlace con el profesional
```

#### 3. Ver Historial
```typescript
// Desde la pantalla "Historial"
- Filtrar por tipo de intervención
- Filtrar por estado
- Ver detalles completos de cada entrada
```

### Flujo del Profesional

#### 1. Escanear QR de Autorización
```typescript
// Usar cámara para escanear QR del paciente
- El sistema valida automáticamente
- Si requiere 2FA, solicita código
- Una vez validado, permite crear entrada
```

#### 2. Registrar Intervención
```typescript
// Formulario completo de nueva intervención
1. Seleccionar tipo (Tratamiento/Intervención/Cirugía)
2. Ingresar título y descripción
3. Agregar medicamentos utilizados
4. Agregar dispositivos/aparatología
5. Guardar con autorización del paciente
```

## 📊 Modelos de Datos

### Patient
```typescript
interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Professional
```typescript
interface Professional {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;      // Número de colegiado
  licenseAuthority: string;   // Autoridad emisora
  centerId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Entry (Tratamiento/Intervención)
```typescript
interface Entry {
  id: string;
  patientId: string;
  type: EntryType;
  status: EntryStatus;
  title: string;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  
  professionalId: string;
  centerId: string;
  medications: Medication[];
  devices: Device[];
  
  notes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Authorization
```typescript
interface Authorization {
  id: string;
  patientId: string;
  type: AuthorizationType;
  status: AuthorizationStatus;
  token: string;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
  requires2FA: boolean;
  permissions: AuthorizationPermissions;
  createdAt: Date;
}
```

Ver `src/types/index.ts` para la lista completa de modelos.

## 🔒 Seguridad

### Autenticación
- Sistema basado en JWT (JSON Web Tokens)
- Tokens almacenados en Expo SecureStore
- Refresh tokens para renovación automática

### Autorización
- Sistema de permisos granular
- Tokens temporales con expiración
- Verificación 2FA opcional
- Revocación inmediata de accesos

### Auditoría
- Log completo de todas las acciones
- Registro de IP y dispositivo
- Trazabilidad de accesos a datos sensibles

### Mejores Prácticas
```typescript
// ✅ Bueno
await SecureStorage.saveAuthToken(token);

// ❌ Malo
AsyncStorage.setItem('token', token);
```

## 🌐 API

### Endpoints Principales

#### Autenticación
```typescript
POST /auth/login
POST /auth/register
POST /auth/logout
POST /auth/refresh
```

#### Pacientes
```typescript
GET    /patients/:id
PUT    /patients/:id
GET    /patients/:id/entries
GET    /patients/:id/authorizations
POST   /patients/:id/authorizations
```

#### Profesionales
```typescript
GET    /professionals/:id
PUT    /professionals/:id
GET    /professionals/:id/entries
```

#### Entradas
```typescript
GET    /entries/:id
POST   /entries
PUT    /entries/:id
DELETE /entries/:id
POST   /entries/:id/medications
POST   /entries/:id/devices
POST   /entries/:id/photos
```

#### Autorizaciones
```typescript
POST   /authorizations/validate
POST   /authorizations/use
POST   /authorizations/:id/revoke
```

### Headers Requeridos
```typescript
Authorization: Bearer <jwt-token>
X-Grant-Id: <authorization-token>  // Solo para operaciones con autorización
Content-Type: application/json
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar linter
npm run lint
```

## 📱 Despliegue

### Build de Producción

#### iOS
```bash
eas build --platform ios
```

#### Android
```bash
eas build --platform android
```

### Publicación en Stores

#### App Store (iOS)
```bash
eas submit --platform ios
```

#### Google Play (Android)
```bash
eas submit --platform android
```

## 📝 Configuración de EAS

Crear archivo `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.glowtrack.com"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🆘 Soporte

Para soporte técnico, contactar a: support@glowtrack.com

## 📚 Documentación Adicional

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Desarrollado con ❤️ para profesionales de medicina estética y sus pacientes**
