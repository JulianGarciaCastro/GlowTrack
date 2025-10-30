# Backend - Guía de Inicio Rápido ⚡

> **De 0 a API funcionando en 5 minutos**

## 🎯 Prerrequisitos Rápidos

```bash
# Node.js 18+
node --version

# PostgreSQL (vía Docker - MÁS FÁCIL)
docker --version
```

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar Dependencias (1 min)

```bash
cd /workspace/glow-track-backend
npm install
```

### 2. Iniciar Base de Datos (1 min)

```bash
# Opción A: Docker (RECOMENDADO)
docker-compose up -d

# Opción B: PostgreSQL local
# Ya debes tener PostgreSQL instalado
createdb glowtrack_db
```

### 3. Ya está Configurado (0 min)

El archivo `.env` ya está creado con valores de desarrollo. ¡No necesitas cambiar nada!

### 4. Iniciar Servidor (1 min)

```bash
npm run start:dev
```

### 5. ¡Listo! (2 min para probar)

Abre tu navegador en:
- **API Docs (Swagger)**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/v1

---

## 🧪 Probar la API

### 1. Registrar un Paciente

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paciente@test.com",
    "password": "test123456",
    "firstName": "Juan",
    "lastName": "García",
    "role": "PATIENT",
    "dateOfBirth": "1990-01-15"
  }'
```

**Respuesta**:
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paciente@test.com",
    "password": "test123456"
  }'
```

### 3. Crear Autorización (QR)

```bash
# Guarda el token del paso anterior
TOKEN="tu-token-aquí"
PATIENT_ID="id-del-paciente"

curl -X POST http://localhost:3000/api/v1/authorizations/patients/$PATIENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "QR_CODE",
    "expiresInHours": 24,
    "maxUses": 1,
    "requires2FA": true,
    "permissions": {
      "canCreateEntry": true,
      "canViewHistory": false,
      "canUploadPhotos": true,
      "entryTypes": ["TREATMENT"]
    }
  }'
```

**Respuesta**:
```json
{
  "id": "...",
  "token": "glowtrack_grant_abc123xyz...",
  "twoFactorCode": "123456",
  "expiresAt": "2025-10-30T...",
  ...
}
```

### 4. Registrar un Profesional

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "test123456",
    "firstName": "María",
    "lastName": "López",
    "role": "PROFESSIONAL",
    "specialty": "Dermatología Estética",
    "licenseNumber": "282912345",
    "licenseAuthority": "Colegio de Médicos de Madrid"
  }'
```

### 5. Validar Autorización (como Profesional)

```bash
curl -X POST http://localhost:3000/api/v1/authorizations/validate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "glowtrack_grant_abc123xyz...",
    "twoFactorCode": "123456"
  }'
```

### 6. Crear Entrada (con Grant)

```bash
PROF_TOKEN="token-del-profesional"
GRANT_TOKEN="glowtrack_grant_abc123xyz..."

curl -X POST http://localhost:3000/api/v1/entries \
  -H "Authorization: Bearer $PROF_TOKEN" \
  -H "X-Grant-Id: $GRANT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "TREATMENT",
    "title": "Tratamiento con ácido hialurónico",
    "description": "Relleno de arrugas con ácido hialurónico",
    "scheduledDate": "2025-11-01T10:00:00Z",
    "professionalId": "id-del-profesional",
    "centerId": "id-del-centro",
    "notes": "Zona de pómulos"
  }'
```

---

## 📊 Verificar Estado

### Base de Datos

```bash
# Ver tablas creadas
docker exec -it glowtrack-postgres psql -U glowtrack -d glowtrack_db -c "\dt"

# Ver usuarios
docker exec -it glowtrack-postgres psql -U glowtrack -d glowtrack_db -c "SELECT id, email, role FROM users;"
```

### Logs del Servidor

```bash
# Ver logs en tiempo real
npm run start:dev
```

---

## 🔥 Comandos Útiles

```bash
# Reiniciar base de datos
docker-compose down -v
docker-compose up -d

# Ver logs de PostgreSQL
docker logs glowtrack-postgres

# Acceder a PostgreSQL
docker exec -it glowtrack-postgres psql -U glowtrack -d glowtrack_db

# Limpiar e instalar
rm -rf node_modules package-lock.json
npm install

# Build de producción
npm run build
npm run start:prod
```

---

## 🚀 Conectar con el Frontend

### 1. Frontend ya configurado

El frontend ya tiene la URL correcta en `.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 2. Si usas dispositivo físico

Cambia `localhost` por tu IP local:

```env
# En el frontend (.env)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api/v1
```

Para saber tu IP:
```bash
# Mac/Linux
ifconfig | grep inet

# Windows
ipconfig
```

### 3. Reiniciar frontend

```bash
cd /workspace
npm start -- --clear
```

---

## ❌ Problemas Comunes

### "Error: connect ECONNREFUSED"
```bash
# Verifica que PostgreSQL esté corriendo
docker ps | grep postgres

# Reinicia
docker-compose restart
```

### "JWT secret not configured"
```bash
# Verifica que .env existe
cat .env

# El JWT_SECRET debe tener al menos 32 caracteres
```

### "Port 3000 already in use"
```bash
# Cambia el puerto en .env
PORT=3001

# O mata el proceso
lsof -ti:3000 | xargs kill -9
```

### "Cannot find module"
```bash
npm install
```

---

## 📚 Siguiente Paso

### Explorar API en Swagger

http://localhost:3000/api/docs

Aquí puedes:
- ✅ Ver todos los endpoints
- ✅ Probar requests directamente
- ✅ Ver esquemas de datos
- ✅ Generar código cliente

---

## ✅ Checklist

- [ ] Backend corriendo en puerto 3000
- [ ] PostgreSQL funcionando
- [ ] Puedes registrar usuarios
- [ ] Puedes hacer login
- [ ] Puedes crear autorizaciones
- [ ] Puedes crear entradas con grants
- [ ] Frontend puede conectarse

---

**¡Listo! El backend está funcionando.** 🎉

**Siguiente**: Abre el frontend y prueba el flujo completo.
