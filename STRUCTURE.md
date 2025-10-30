# Glow Track - Estructura del Proyecto

Árbol completo de archivos y directorios del proyecto.

```
glow-track/
│
├── 📄 Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── babel.config.js                 # Babel configuration
│   ├── app.json                        # Expo configuration
│   ├── .eslintrc.js                    # ESLint rules
│   ├── jest.config.js                  # Jest configuration
│   ├── jest.setup.js                   # Jest setup and mocks
│   ├── .env.example                    # Environment variables template
│   └── .gitignore                      # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                       # Main documentation
│   ├── ARCHITECTURE.md                 # Technical architecture
│   ├── SECURITY.md                     # Security documentation
│   ├── CONTRIBUTING.md                 # Contribution guide
│   ├── PROJECT_SUMMARY.md              # Executive summary
│   ├── STRUCTURE.md                    # This file
│   └── API_CONTRACT_EXAMPLE.yaml       # OpenAPI specification
│
├── 🎨 Assets
│   └── README.md                       # Asset requirements
│   ├── icon.png                        # (to be created)
│   ├── splash.png                      # (to be created)
│   ├── adaptive-icon.png               # (to be created)
│   └── favicon.png                     # (to be created)
│
├── 🚀 Entry Point
│   └── App.tsx                         # Main application component
│
└── 📁 src/
    │
    ├── 🧩 components/                  # Reusable components
    │   ├── index.ts                    # Component exports
    │   ├── Calendar/
    │   │   └── MonthCalendar.tsx       # Monthly calendar component
    │   └── QRCode/
    │       ├── QRGenerator.tsx         # QR code generator
    │       └── QRScanner.tsx           # QR code scanner
    │
    ├── 📱 screens/                     # Application screens
    │   ├── index.ts                    # Screen exports
    │   ├── auth/
    │   │   └── LoginScreen.tsx         # Login screen
    │   ├── patient/
    │   │   ├── CalendarScreen.tsx      # Patient calendar
    │   │   ├── HistoryScreen.tsx       # Treatment history
    │   │   ├── ShareScreen.tsx         # Share authorizations
    │   │   └── ProfileScreen.tsx       # Patient profile
    │   └── professional/
    │       ├── EntriesScreen.tsx       # Professional entries
    │       └── NewEntryScreen.tsx      # New entry form
    │
    ├── 🧭 navigation/
    │   └── index.tsx                   # Navigation configuration
    │
    ├── 🔧 services/
    │   └── auth.tsx                    # Authentication service
    │
    ├── 🌐 sdk/
    │   └── api.ts                      # API client wrapper
    │
    ├── 📝 types/
    │   └── index.ts                    # TypeScript type definitions
    │
    └── 🛠 utils/
        ├── constants.ts                # Application constants
        └── formatters.ts               # Utility formatters

```

## Conteo de Archivos

### Por Categoría
- **Configuración**: 9 archivos
- **Documentación**: 7 archivos
- **Código TypeScript**: 18 archivos
- **Assets**: 1 archivo (+ 4 a crear)

### Por Tipo
- `.ts/.tsx`: 18 archivos
- `.js`: 3 archivos
- `.json`: 2 archivos
- `.md`: 7 archivos
- `.yaml`: 1 archivo

**Total**: 31 archivos (+ 4 assets a crear)

## Líneas de Código Estimadas

| Categoría | Archivos | Líneas Aprox. |
|-----------|----------|---------------|
| Tipos y Modelos | 1 | 450 |
| SDK y API | 1 | 500 |
| Servicios | 1 | 200 |
| Componentes | 3 | 800 |
| Pantallas | 7 | 1,800 |
| Navegación | 1 | 200 |
| Utilidades | 2 | 250 |
| Configuración | 9 | 300 |
| **Código Total** | **25** | **~4,500** |
| Documentación | 7 | ~3,500 |
| **Gran Total** | **32** | **~8,000** |

## Dependencias Principales

### Producción
```json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "expo-secure-store": "~12.8.0",
  "expo-barcode-scanner": "~12.9.0",
  "react-native-calendars": "^1.1302.0",
  "react-native-qrcode-svg": "^6.2.0",
  "date-fns": "^3.0.6",
  "zustand": "^4.4.7"
}
```

### Desarrollo
```json
{
  "@types/react": "~18.2.45",
  "typescript": "^5.3.0",
  "jest": "^29.0.0",
  "eslint": "^8.0.0"
}
```

## Tamaño Estimado

- **Código fuente**: ~1.5 MB
- **node_modules**: ~200 MB
- **Build iOS**: ~30-40 MB
- **Build Android**: ~25-35 MB
- **Assets** (cuando se creen): ~5 MB

## Rutas Importantes

### Desarrollo
```bash
/workspace/src/              # Código fuente
/workspace/src/types/        # Tipos TypeScript
/workspace/src/sdk/          # SDK wrapper
/workspace/src/screens/      # Pantallas
/workspace/src/components/   # Componentes
```

### Configuración
```bash
/workspace/package.json      # Dependencias
/workspace/app.json          # Config de Expo
/workspace/tsconfig.json     # Config de TypeScript
/workspace/.env              # Variables de entorno
```

### Documentación
```bash
/workspace/README.md         # Documentación principal
/workspace/ARCHITECTURE.md   # Arquitectura
/workspace/SECURITY.md       # Seguridad
```

## Comandos Útiles

### Navegación Rápida
```bash
# Ver estructura completa
find . -type f | grep -v node_modules | sort

# Contar archivos TypeScript
find src -name "*.ts" -o -name "*.tsx" | wc -l

# Contar líneas de código
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Buscar en código
grep -r "pattern" src/

# Ver tamaño de directorios
du -sh src/ node_modules/
```

### Desarrollo
```bash
# Iniciar servidor
npm start

# Ejecutar tests
npm test

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Convenciones de Nombres

### Archivos
- **Componentes**: `PascalCase.tsx` (ej: `MonthCalendar.tsx`)
- **Screens**: `PascalCase.tsx` con sufijo `Screen` (ej: `LoginScreen.tsx`)
- **Servicios**: `camelCase.tsx` (ej: `auth.tsx`)
- **Utilidades**: `camelCase.ts` (ej: `formatters.ts`)
- **Tipos**: `index.ts` en carpeta `types/`

### Directorios
- **Minúsculas**: Para carpetas de código (`src/`, `components/`)
- **PascalCase**: Para subcarpetas de componentes (`Calendar/`, `QRCode/`)

## Estado del Proyecto

### ✅ Completado (100%)
- [x] Estructura de carpetas
- [x] Configuración de TypeScript
- [x] Configuración de Expo
- [x] Modelos de datos
- [x] SDK wrapper
- [x] Sistema de autenticación
- [x] Componentes principales
- [x] Pantallas del paciente
- [x] Pantallas del profesional
- [x] Sistema de navegación
- [x] Documentación completa

### 📋 Pendiente
- [ ] Crear assets gráficos (icon, splash, etc.)
- [ ] Implementar backend API
- [ ] Escribir tests unitarios
- [ ] Escribir tests de integración
- [ ] Setup CI/CD
- [ ] Configurar Sentry para error tracking

### 🔄 En Progreso
- [ ] Integración con backend (esperando API)

## Próximos Archivos a Crear

### Tests
```
src/
├── __tests__/
│   ├── components/
│   │   ├── MonthCalendar.test.tsx
│   │   ├── QRGenerator.test.tsx
│   │   └── QRScanner.test.tsx
│   ├── services/
│   │   └── auth.test.tsx
│   └── utils/
│       ├── formatters.test.ts
│       └── constants.test.ts
```

### Pantallas Adicionales
```
src/screens/
├── auth/
│   └── RegisterScreen.tsx
├── patient/
│   ├── EntryDetailScreen.tsx
│   └── EditProfileScreen.tsx
├── professional/
│   ├── CenterScreen.tsx
│   └── ScanQRScreen.tsx
└── common/
    └── NotFoundScreen.tsx
```

---

**Generado**: Octubre 2025
**Herramienta**: Estructura manual basada en análisis del proyecto
