# Glow Track - Índice de Documentación

> **Guía maestra para navegar toda la documentación del proyecto**

## 📚 Documentación Principal

### 1. [README.md](README.md) - Punto de Inicio
**¿Para quién?** Todos (Desarrolladores, Product Owners, Stakeholders)

**Contenido:**
- Descripción general del proyecto
- Características principales
- Instalación y configuración
- Guía de uso básico
- Estructura del proyecto
- API endpoints
- Testing y deployment

**Empieza aquí si:** Es tu primer contacto con el proyecto

---

### 2. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Resumen Ejecutivo
**¿Para quién?** Product Owners, Managers, Stakeholders

**Contenido:**
- Visión general del MVP
- Estado del proyecto (100% completado)
- Entregables completados
- Estadísticas del proyecto
- Arquitectura resumida
- Próximos pasos
- KPIs y métricas

**Lee esto si:** Necesitas un overview rápido del estado del proyecto

---

### 3. [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura Técnica
**¿Para quién?** Desarrolladores, Arquitectos de Software, Tech Leads

**Contenido:**
- Principios de diseño (API-First)
- Componentes principales detallados
- Flujos de datos completos
- SDK Wrapper explicado
- Sistema de autenticación
- Sistema de autorizaciones
- Seguridad por capas
- Escalabilidad y performance
- Testing strategy
- Deployment pipeline
- Monitoreo

**Lee esto si:** Necesitas entender cómo funciona el sistema por dentro

---

### 4. [SECURITY.md](SECURITY.md) - Seguridad
**¿Para quién?** Security Engineers, Desarrolladores, Compliance Officers

**Contenido:**
- Clasificación de datos
- Sistema de autenticación JWT
- Sistema de autorizaciones temporales (Grants)
- Verificación 2FA
- Almacenamiento seguro
- Comunicación HTTPS
- Auditoría y logging
- Gestión de permisos
- Manejo de errores seguro
- Compliance (GDPR, LOPD)
- Reporte de vulnerabilidades

**Lee esto si:** Te preocupa la seguridad o necesitas documentar compliance

---

### 5. [CONTRIBUTING.md](CONTRIBUTING.md) - Guía de Contribución
**¿Para quién?** Desarrolladores que contribuirán al proyecto

**Contenido:**
- Código de conducta
- Proceso de contribución
- Convenciones de commits
- Estándares de código
- Nomenclatura
- Testing requirements
- Documentación de código
- Proceso de code review

**Lee esto si:** Vas a hacer cambios al código

---

### 6. [STRUCTURE.md](STRUCTURE.md) - Estructura del Proyecto
**¿Para quién?** Desarrolladores nuevos en el proyecto

**Contenido:**
- Árbol completo de directorios
- Conteo de archivos
- Líneas de código por categoría
- Dependencias principales
- Rutas importantes
- Comandos útiles
- Convenciones de nombres
- Estado del proyecto

**Lee esto si:** Necesitas navegar el código eficientemente

---

### 7. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist de Despliegue
**¿Para quién?** Release Managers, DevOps, QA Engineers

**Contenido:**
- Pre-requisitos completos
- Configuración de assets
- Variables de entorno
- Checklist de seguridad
- Testing exhaustivo
- Legal y compliance
- Build de iOS y Android
- Publicación en stores
- Post-lanzamiento
- Plan de contingencia

**Lee esto si:** Estás preparando un release a producción

---

### 8. [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml) - Contrato API
**¿Para quién?** Backend Developers, API Designers

**Contenido:**
- Especificación OpenAPI 3.0
- Todos los endpoints definidos
- Schemas de datos
- Autenticación y headers
- Request/Response examples
- Error responses

**Lee esto si:** Necesitas implementar el backend o entender la API

---

## 🗂 Organización por Audiencia

### Para Desarrolladores Frontend
**Orden de lectura recomendado:**
1. [README.md](README.md) - Setup inicial
2. [STRUCTURE.md](STRUCTURE.md) - Navegar el código
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Entender la arquitectura
4. [CONTRIBUTING.md](CONTRIBUTING.md) - Estándares de código
5. [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml) - Entender API

### Para Desarrolladores Backend
**Orden de lectura recomendado:**
1. [README.md](README.md) - Overview
2. [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml) - Implementar API
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Flujos de datos
4. [SECURITY.md](SECURITY.md) - Implementar seguridad
5. [CONTRIBUTING.md](CONTRIBUTING.md) - Estándares

### Para QA Engineers
**Orden de lectura recomendado:**
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Funcionalidades
2. [README.md](README.md) - Configuración
3. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Casos de prueba
4. [SECURITY.md](SECURITY.md) - Security testing

### Para Product Owners / Managers
**Orden de lectura recomendado:**
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Overview completo
2. [README.md](README.md) - Características
3. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Requirements para launch

### Para Security / Compliance
**Orden de lectura recomendado:**
1. [SECURITY.md](SECURITY.md) - Todo sobre seguridad
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura de seguridad
3. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Legal checklist

---

## 🔍 Búsqueda Rápida por Tema

### Autenticación
- **Setup**: [README.md](README.md) → Sección "Configuración"
- **Arquitectura**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Sistema de Autenticación"
- **Seguridad**: [SECURITY.md](SECURITY.md) → "Autenticación y Autorización"
- **Código**: `src/services/auth.tsx`

### Autorizaciones (QR/2FA)
- **Flujo**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Sistema de Autorizaciones"
- **Seguridad**: [SECURITY.md](SECURITY.md) → "Sistema de Autorización Temporal"
- **API**: [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml) → `/authorizations/*`
- **Código**: `src/components/QRCode/` y `src/screens/patient/ShareScreen.tsx`

### Calendario
- **Uso**: [README.md](README.md) → "Flujo del Paciente"
- **Componente**: `src/components/Calendar/MonthCalendar.tsx`
- **Pantalla**: `src/screens/patient/CalendarScreen.tsx`

### SDK / API Integration
- **Arquitectura**: [ARCHITECTURE.md](ARCHITECTURE.md) → "SDK Wrapper"
- **API Spec**: [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml)
- **Código**: `src/sdk/api.ts`

### Testing
- **Strategy**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Testing"
- **Configuración**: `jest.config.js`, `jest.setup.js`
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) → "Testing"

### Deployment
- **Guía completa**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Configuración**: [README.md](README.md) → "Despliegue"
- **Pipeline**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Deployment"

### Tipos / Modelos de Datos
- **Definiciones**: `src/types/index.ts`
- **API Schemas**: [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml) → "Components/Schemas"
- **Arquitectura**: [ARCHITECTURE.md](ARCHITECTURE.md) → "Modelos de Datos"

---

## 📊 Documentación por Estado

### ✅ Completo y Actualizado
- [README.md](README.md)
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [SECURITY.md](SECURITY.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [STRUCTURE.md](STRUCTURE.md)
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml)

### 📝 A Crear (Post-MVP)
- User Manual (para usuarios finales)
- API Implementation Guide (para backend)
- Troubleshooting Guide
- Performance Optimization Guide
- Migration Guides (para actualizaciones)

---

## 🎯 FAQs por Tipo de Pregunta

### "¿Cómo hago...?"
→ [README.md](README.md) sección "Uso"

### "¿Por qué se diseñó así...?"
→ [ARCHITECTURE.md](ARCHITECTURE.md) sección "Principios de Diseño"

### "¿Es esto seguro...?"
→ [SECURITY.md](SECURITY.md)

### "¿Puedo cambiar...?"
→ [CONTRIBUTING.md](CONTRIBUTING.md)

### "¿Qué falta para producción...?"
→ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

### "¿Dónde está el código de...?"
→ [STRUCTURE.md](STRUCTURE.md)

---

## 🔗 Links Externos Útiles

### Frameworks & Libraries
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Security & Compliance
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [GDPR Info](https://gdpr.eu/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)

### Testing
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

### Deployment
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

## 📧 Contactos

### Preguntas Técnicas
- **Email**: development@glowtrack.com
- **Documentación**: Este repositorio

### Seguridad
- **Email**: security@glowtrack.com
- **Reporte de vulnerabilidades**: [SECURITY.md](SECURITY.md)

### Soporte General
- **Email**: support@glowtrack.com

---

## 🔄 Mantenimiento de Documentación

### Responsabilidad
- **Tech Lead**: Mantener arquitectura y decisiones técnicas
- **Developers**: Actualizar al hacer cambios significativos
- **QA**: Actualizar checklists y casos de prueba
- **Product**: Actualizar features y roadmap

### Frecuencia de Revisión
- **Cada Sprint**: Actualizar si hay cambios
- **Cada Release**: Revisar toda la documentación
- **Trimestral**: Auditoría completa de documentación

### Versionado
La documentación sigue el versionado del proyecto en `package.json`

---

**Última actualización**: Octubre 2025
**Versión del proyecto**: 1.0.0 (MVP)
**Mantenido por**: Glow Track Development Team

---

> 💡 **Tip**: Marca esta página como favorita. Es tu punto de entrada a toda la documentación del proyecto.
