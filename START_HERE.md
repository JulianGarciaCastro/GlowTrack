# 🚀 INICIO RÁPIDO - Glow Track

## ✅ TODO ARREGLADO

He instalado y configurado todo lo necesario. **Ya puedes iniciar la app.**

---

## ⚡ Iniciar AHORA

```bash
npm start
```

**Cuando veas el menú, presiona `w` para web**

O directamente:

```bash
npm run web
```

---

## 🔧 Qué se Arregló

### ✅ Dependencias Instaladas:
- `babel-plugin-module-resolver`
- `react-native-web`
- `react-dom`
- `react-native-reanimated`

### ✅ Configuración Simplificada:
- Removidos assets innecesarios de `app.json`
- Simplificada configuración para desarrollo web
- Limpiado caché de Expo

### ✅ Archivos Actualizados:
- `app.json` - Configuración mínima para web
- `babel.config.js` - Ya estaba correcto
- Caché limpiado

---

## 📋 Si Aún Hay Errores

### Limpiar Todo y Reintentar:

```bash
# Limpiar caché
rm -rf .expo node_modules/.cache

# Reiniciar
npm start -- --clear
```

### Si dice "Port in use":

```bash
# Usa otro puerto
npx expo start --port 19001
```

---

## 🎯 Siguiente Paso

Una vez que la app cargue en el navegador, puedes:

1. **Ver la UI** - Verás las pantallas aunque sin backend funcional
2. **Iniciar el Backend** - Para funcionalidad completa:
   ```bash
   cd glow-track-backend
   docker-compose up -d
   npm run start:dev
   ```

---

## ✅ Assets No Necesarios para Web

Los siguientes archivos **NO** son necesarios para desarrollo web:
- ❌ icon.png
- ❌ splash.png
- ❌ adaptive-icon.png
- ❌ favicon.png

Solo los necesitas cuando compiles para iOS/Android.

---

## 🚀 ¡Ejecuta Ahora!

```bash
npm start
```

Presiona `w` cuando aparezca el menú.

**Se abrirá en:** `http://localhost:19006`

🎉 **¡Listo para probar Glow Track!**
