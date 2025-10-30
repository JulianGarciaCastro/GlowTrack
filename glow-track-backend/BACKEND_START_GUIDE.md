# 🚀 Backend - Guía de Inicio

## ✅ Errores TypeScript Arreglados

He corregido todos los errores de TypeScript en el código.

---

## 🐘 Iniciar PostgreSQL

### **Opción 1: Docker (Recomendado)**

```bash
# Si tienes Docker instalado
cd glow-track-backend
docker compose up -d

# O con docker-compose (versión antigua)
docker-compose up -d
```

### **Opción 2: PostgreSQL Local (Sin Docker)**

Si NO tienes Docker, puedes usar PostgreSQL local:

#### **Windows (con Laragon):**

Tu Laragon ya tiene PostgreSQL. Solo necesitas:

1. **Abrir Laragon**
2. **Iniciar PostgreSQL** (click en "Start All")
3. **Crear la base de datos:**

```bash
# Abrir terminal de Laragon o CMD
cd C:\laragon\bin\postgresql\postgresql-16.x\bin

# Conectar a PostgreSQL
psql -U postgres

# Crear database y usuario
CREATE DATABASE glowtrack_db;
CREATE USER glowtrack WITH PASSWORD 'glowtrack_password';
GRANT ALL PRIVILEGES ON DATABASE glowtrack_db TO glowtrack;
\q
```

#### **Configurar .env para Laragon:**

```env
# Editar glow-track-backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=glowtrack
DB_PASSWORD=glowtrack_password
DB_DATABASE=glowtrack_db
```

---

## 🚀 Iniciar el Backend

Una vez que PostgreSQL esté corriendo:

```bash
cd glow-track-backend
npm run start:dev
```

**Deberías ver:**
```
[Nest] Starting Nest application...
[Nest] AppModule dependencies initialized
[Nest] Successfully connected to database
```

---

## ✅ Verificar que Funciona

### **1. API Docs (Swagger):**
http://localhost:3000/api/docs

### **2. Health Check:**
http://localhost:3000/api/v1

### **3. Registrar un usuario:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User",
    "role": "PATIENT",
    "dateOfBirth": "1990-01-01"
  }'
```

---

## 🐛 Si Aún Hay Errores

### **Error: Cannot connect to database**

**Solución**: PostgreSQL no está corriendo.

```bash
# Verificar si PostgreSQL está corriendo
# Windows (Laragon):
# - Abrir Laragon
# - Click "Start All"

# Docker:
docker compose ps
# Si no está corriendo:
docker compose up -d
```

### **Error: Database does not exist**

```sql
-- Conectar a PostgreSQL y crear DB
psql -U postgres
CREATE DATABASE glowtrack_db;
```

### **Error: TypeScript compilation errors**

Ya están arreglados. Si ves errores, ejecuta:

```bash
rm -rf dist
npm run start:dev
```

---

## 📊 Estructura de Desarrollo

```
Terminal 1: Backend
cd glow-track-backend
npm run start:dev
http://localhost:3000

Terminal 2: Frontend
cd ..
npm start
# Presiona 'w'
http://localhost:19006
```

---

## 🎯 Resumen Rápido

### **Con Laragon (Windows):**

```bash
# 1. Abrir Laragon y hacer "Start All"
# 2. Crear DB (solo primera vez) - Ver arriba
# 3. Iniciar backend:
cd glow-track-backend
npm run start:dev

# 4. Ver docs:
# http://localhost:3000/api/docs
```

### **Con Docker:**

```bash
# 1. Iniciar PostgreSQL
docker compose up -d

# 2. Iniciar backend
npm run start:dev

# 3. Ver docs:
# http://localhost:3000/api/docs
```

---

## ✅ Checklist

- [ ] PostgreSQL corriendo (Laragon o Docker)
- [ ] Base de datos `glowtrack_db` creada
- [ ] `.env` configurado correctamente
- [ ] `npm run start:dev` sin errores
- [ ] http://localhost:3000/api/docs funciona

---

**¡Ya está todo listo para funcionar!** 🎉
