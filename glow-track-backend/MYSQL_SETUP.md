# 🐬 Backend Configurado para MySQL

## ✅ Cambios Realizados

He modificado el backend para usar **MySQL** en lugar de PostgreSQL.

### **Archivos Modificados:**
- ✅ `package.json` - Instalado driver `mysql2`
- ✅ `typeorm.config.ts` - Cambiado a MySQL
- ✅ `.env` - Configurado para Laragon (usuario root, sin password)
- ✅ Entidades - Cambiado `jsonb` → `json` (compatible con MySQL)
- ✅ Arrays - Cambiado a JSON (MySQL no soporta arrays nativos)

---

## 🚀 Paso a Paso con Laragon

### **1. Abrir Laragon**
1. Abre la aplicación **Laragon**
2. Click en **"Start All"** o **"Start"**
3. Espera a que MySQL tenga ícono **verde** ✅

### **2. Crear la Base de Datos**

Abre **PowerShell** o **CMD** y ejecuta:

```bash
# Ir al proyecto backend
cd C:\laragon\www\glow-track\GlowTrack\glow-track-backend

# Conectar a MySQL (Laragon usa root sin password)
mysql -u root

# Dentro de MySQL (verás mysql>):
CREATE DATABASE glowtrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
exit
```

Deberías ver `glowtrack_db` en la lista de bases de datos.

### **3. Iniciar el Backend**

```bash
npm run start:dev
```

---

## ✅ Deberías Ver (SIN ERRORES):

```
[Nest] Starting Nest application...
[Nest] AppModule dependencies initialized
[Nest] TypeOrmModule dependencies initialized
[Nest] Successfully connected to database      ← ¡ESTO!
[Nest] AuthModule dependencies initialized
[Nest] PatientsModule dependencies initialized
[Nest] Mapped {/api/v1/auth/register, POST} route
[Nest] Mapped {/api/v1/auth/login, POST} route
[Nest] Nest application successfully started

🚀 Glow Track API is running!

📝 API: http://localhost:3000/api/v1
📚 Docs: http://localhost:3000/api/docs
🌍 Environment: development
```

---

## 🐛 Si Hay Errores

### **Error: "Access denied for user 'root'"**

**Solución:** Necesitas configurar password de MySQL en Laragon.

```bash
# En .env cambia:
DB_PASSWORD=tu_password_de_mysql
```

### **Error: "Unknown database 'glowtrack_db'"**

**Solución:** No creaste la base de datos.

```bash
mysql -u root -p
CREATE DATABASE glowtrack_db;
exit
```

### **Error: "Can't connect to MySQL server"**

**Solución:** MySQL no está corriendo.

1. Abre **Laragon**
2. Click **"Start All"**
3. Verifica que MySQL esté en verde

---

## 📊 Configuración Actual

### **Base de Datos: MySQL**
```
Host: localhost
Port: 3306
User: root
Password: (vacío en Laragon por defecto)
Database: glowtrack_db
```

### **Conexión:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=glowtrack_db
```

---

## 🔍 Verificar MySQL en Laragon

### **Opción 1: Por Laragon UI**
Abre Laragon → Deberías ver:
```
MySQL: [●] Running    ← Verde = OK
```

### **Opción 2: Por Terminal**
```bash
# Ver si MySQL está corriendo
tasklist | findstr mysql

# Conectar a MySQL
mysql -u root

# Dentro de MySQL:
SHOW DATABASES;
# Deberías ver glowtrack_db
```

---

## 🎯 Comandos Útiles MySQL

```bash
# Conectar a MySQL
mysql -u root

# Ver bases de datos
SHOW DATABASES;

# Usar la base de datos
USE glowtrack_db;

# Ver tablas (después de que el backend cree las tablas)
SHOW TABLES;

# Ver estructura de una tabla
DESCRIBE users;

# Salir
exit
```

---

## 📚 HeidiSQL (Opcional - Visual)

Laragon incluye **HeidiSQL** para gestionar MySQL visualmente:

1. Abrir **Laragon**
2. Click en **"Database"** → **"Open"**
3. Se abre HeidiSQL
4. Conectar con:
   - Host: localhost
   - User: root
   - Password: (dejar vacío)
5. Ver `glowtrack_db` en el árbol

---

## 🚀 Inicio Rápido

```bash
# 1. Abrir Laragon y hacer "Start All"

# 2. Crear base de datos (solo primera vez)
mysql -u root
CREATE DATABASE glowtrack_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

# 3. Iniciar backend
cd C:\laragon\www\glow-track\GlowTrack\glow-track-backend
npm run start:dev

# 4. Verificar
# http://localhost:3000/api/docs
```

---

## ✅ Checklist

- [ ] Laragon abierto y "Start All" ejecutado
- [ ] MySQL corriendo (ícono verde)
- [ ] Base de datos `glowtrack_db` creada
- [ ] Backend iniciado: `npm run start:dev`
- [ ] Sin errores en la terminal
- [ ] http://localhost:3000/api/docs funciona

---

**¡Backend listo para MySQL con Laragon!** 🎉
