# Glow Track - Guía de Inicio Rápido ⚡

> **De 0 a running en 10 minutos**

## 🎯 Objetivo

Esta guía te llevará desde clonar el repositorio hasta tener la app corriendo en tu simulador/dispositivo en el menor tiempo posible.

## ⚡ Pasos Rápidos

### 1. Pre-requisitos (2 minutos)

**Instala lo básico:**
```bash
# Node.js (si no lo tienes)
# Descarga desde: https://nodejs.org/

# Expo CLI
npm install -g expo-cli

# Verifica instalación
node --version  # Debe ser 18+
npm --version
expo --version
```

### 2. Clonar y Setup (3 minutos)

```bash
# Clonar repositorio
git clone https://github.com/your-org/glow-track.git
cd glow-track

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tu editor favorito
# nano .env
# o
# code .env
```

**Contenido mínimo del .env:**
```env
EXPO_PUBLIC_API_URL=https://api.glowtrack.com
```

### 3. Iniciar Desarrollo (1 minuto)

```bash
# Iniciar servidor de desarrollo
npm start
```

Verás algo como:
```
› Metro waiting on exp://192.168.1.100:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### 4. Ejecutar en Dispositivo (4 minutos)

#### Opción A: Dispositivo Físico (más fácil)

**iOS:**
1. Descarga [Expo Go](https://apps.apple.com/app/expo-go/id982107779) del App Store
2. Abre la app
3. Escanea el QR del terminal con la cámara

**Android:**
1. Descarga [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) de Google Play
2. Abre la app
3. Escanea el QR del terminal con la app Expo Go

#### Opción B: Simulador/Emulador (requiere configuración previa)

**iOS Simulator:**
```bash
# Presiona 'i' en el terminal
# O ejecuta:
npm run ios
```

**Android Emulator:**
```bash
# Presiona 'a' en el terminal
# O ejecuta:
npm run android
```

---

## 🎉 ¡Listo!

Si todo salió bien, deberías ver la pantalla de login de Glow Track.

### Credenciales de Prueba (Mock)

> ⚠️ **Nota**: Como el backend aún no está implementado, estas credenciales no funcionarán. Necesitas primero implementar el backend según [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml)

**Paciente:**
- Email: `paciente@test.com`
- Password: `test123`

**Profesional:**
- Email: `profesional@test.com`
- Password: `test123`

---

## 🐛 Problemas Comunes

### Error: "Metro bundler failed"
```bash
# Limpiar caché
npm start -- --clear
```

### Error: "Unable to resolve module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error: "Network error" en la app
- Verifica que `EXPO_PUBLIC_API_URL` esté configurado en `.env`
- Verifica que el backend esté corriendo
- Verifica que estés en la misma red (si usas localhost)

### No se conecta al dispositivo
- Asegúrate de estar en la misma red WiFi
- Desactiva VPN si tienes una activa
- Reinicia Expo: Ctrl+C y `npm start` de nuevo

---

## 📱 Explorando la App

### Como Paciente
1. **Calendario Tab** 📅
   - Vista mensual de tratamientos
   - Click en fecha para ver detalles
   - Colores indican tipo de tratamiento

2. **Historial Tab** 📋
   - Lista completa de entradas
   - Filtros por tipo y estado
   - Click para ver detalles

3. **Compartir Tab** 🔗
   - Genera QR/Link de autorización
   - Configura permisos y 2FA
   - Revoca autorizaciones

4. **Perfil Tab** 👤
   - Información personal
   - Configuración
   - Cerrar sesión

### Como Profesional
1. **Intervenciones Tab** 📋
   - Lista de tus intervenciones
   - Click para ver detalles

2. **Nuevo Registro Tab** ➕
   - Escanea QR del paciente
   - Registra tratamiento
   - Agrega medicamentos/dispositivos

3. **Perfil Tab** 👤
   - Información profesional
   - Centro asociado
   - Cerrar sesión

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Unit tests
npm test

# Con coverage
npm test -- --coverage

# Watch mode (útil durante desarrollo)
npm test -- --watch
```

### Linting
```bash
# Ver errores
npm run lint

# Auto-fix (algunos errores)
npm run lint -- --fix
```

---

## 🚀 Próximos Pasos

### Para Desarrolladores Frontend
1. ✅ App corriendo
2. 📖 Lee [STRUCTURE.md](STRUCTURE.md) para entender el código
3. 🏗 Lee [ARCHITECTURE.md](ARCHITECTURE.md) para entender la arquitectura
4. 🔨 Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de hacer cambios
5. 💻 ¡Empieza a codear!

### Para Desarrolladores Backend
1. ✅ App corriendo (para ver qué consumir)
2. 📄 Lee [API_CONTRACT_EXAMPLE.yaml](API_CONTRACT_EXAMPLE.yaml)
3. 🔒 Lee [SECURITY.md](SECURITY.md) para requisitos de seguridad
4. 🏗 Implementa los endpoints según el contrato
5. 🔗 Conecta la app al backend cambiando `EXPO_PUBLIC_API_URL`

### Para QA
1. ✅ App corriendo
2. 📋 Lee [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) sección Testing
3. 🧪 Ejecuta tests manuales
4. 🐛 Reporta bugs en Issues

---

## 📚 Documentación Completa

Esta es solo la guía de inicio rápido. Para documentación completa:

- **Índice maestro**: [INDEX.md](INDEX.md)
- **README completo**: [README.md](README.md)
- **Resumen del proyecto**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## 💬 ¿Atascado?

### Opciones:
1. 🔍 Busca en [INDEX.md](INDEX.md) por tema
2. 📖 Lee el [README.md](README.md) completo
3. 💬 Pregunta en Slack/Discord/Team Chat
4. 📧 Email: development@glowtrack.com

---

## ⏱️ Tiempo Total

- **Setup inicial**: ~5-10 minutos
- **Primera exploración**: ~15 minutos
- **Lectura de docs principales**: ~30 minutos
- **Entendimiento profundo**: ~2-3 horas

---

## ✅ Checklist de Verificación

Antes de empezar a desarrollar, asegúrate de:

- [ ] App corre sin errores
- [ ] Puedes navegar entre pantallas
- [ ] Entiendes la estructura del proyecto
- [ ] Has leído [CONTRIBUTING.md](CONTRIBUTING.md)
- [ ] Tienes acceso al repositorio
- [ ] Conoces el proceso de PR
- [ ] Sabes cómo ejecutar tests

---

**¡Bienvenido al proyecto Glow Track! 🎉**

**Siguiente paso recomendado**: [INDEX.md](INDEX.md) para navegar toda la documentación.
