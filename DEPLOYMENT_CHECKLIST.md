# Glow Track - Checklist de Despliegue

Lista completa de verificación antes de desplegar a producción.

## 🎯 Pre-Requisitos

### Cuentas y Accesos
- [ ] Cuenta de Apple Developer ($99/año)
- [ ] Cuenta de Google Play Console ($25 pago único)
- [ ] Cuenta de Expo
- [ ] Acceso al repositorio Git
- [ ] Acceso al backend de producción

### Herramientas
- [ ] Node.js 18+ instalado
- [ ] Expo CLI instalado (`npm install -g expo-cli`)
- [ ] EAS CLI instalado (`npm install -g eas-cli`)
- [ ] Git configurado
- [ ] IDE configurado (VS Code recomendado)

## 📱 Configuración de Assets

### Imágenes Requeridas
- [ ] `icon.png` (1024x1024px) - Icono de la app
- [ ] `splash.png` (1242x2436px) - Pantalla de inicio
- [ ] `adaptive-icon.png` (1024x1024px) - Icono adaptativo Android
- [ ] `favicon.png` (48x48px) - Icono para web

### Screenshots para Stores
- [ ] iPhone 6.7" (1290x2796px) - 3-5 screenshots
- [ ] iPhone 6.5" (1284x2778px) - 3-5 screenshots
- [ ] iPad Pro 12.9" (2048x2732px) - 2-3 screenshots
- [ ] Android Phone - 3-5 screenshots
- [ ] Android Tablet - 2-3 screenshots

### Recursos de Marketing
- [ ] Logo en alta resolución
- [ ] Banner para web/redes sociales
- [ ] Video demo (opcional pero recomendado)
- [ ] Descripción corta (80 caracteres)
- [ ] Descripción larga (4000 caracteres)
- [ ] Keywords para ASO

## ⚙️ Configuración del Proyecto

### Variables de Entorno
```bash
# .env.production
EXPO_PUBLIC_API_URL=https://api.glowtrack.com
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
EXPO_PUBLIC_ANALYTICS_ID=your-analytics-id
```

- [ ] Archivo `.env.production` creado
- [ ] API URL de producción configurada
- [ ] Sentry DSN configurado (si se usa)
- [ ] Analytics configurado (si se usa)

### app.json
- [ ] `name` y `slug` finales
- [ ] `version` actualizada (ej: 1.0.0)
- [ ] `orientation` configurado
- [ ] `icon` y `splash` apuntando a assets correctos
- [ ] `ios.bundleIdentifier` único (ej: com.glowtrack.app)
- [ ] `android.package` único (ej: com.glowtrack.app)
- [ ] Permisos iOS configurados (Camera, Photos, FaceID)
- [ ] Permisos Android configurados
- [ ] `scheme` configurado para deep links

### package.json
- [ ] Versión actualizada
- [ ] Todas las dependencias en última versión estable
- [ ] Scripts de build configurados
- [ ] Licencia especificada

## 🔒 Seguridad

### Código
- [ ] No hay console.logs innecesarios
- [ ] No hay TODOs o FIXMEs críticos
- [ ] No hay credenciales hardcodeadas
- [ ] No hay API keys en código
- [ ] SecureStore usado para datos sensibles
- [ ] Validación de inputs en todos los formularios

### API
- [ ] HTTPS configurado
- [ ] Certificado SSL válido
- [ ] CORS configurado correctamente
- [ ] Rate limiting implementado
- [ ] JWT con expiración apropiada
- [ ] Refresh tokens funcionando

### Permisos
- [ ] Solo permisos necesarios solicitados
- [ ] Descripciones de permisos claras
- [ ] Permisos solicitados en momento apropiado

## 🧪 Testing

### Tests Automatizados
- [ ] Unit tests escritos y pasando
- [ ] Integration tests escritos y pasando
- [ ] E2E tests ejecutados (si existen)
- [ ] Coverage > 80%

### Tests Manuales

#### Funcionalidad Core
- [ ] Login funciona correctamente
- [ ] Registro de usuario funciona
- [ ] Logout limpia sesión
- [ ] Refresh token renueva automáticamente

#### Paciente
- [ ] Calendario se muestra correctamente
- [ ] Entradas aparecen en fechas correctas
- [ ] Filtros de historial funcionan
- [ ] Generación de QR funciona
- [ ] Compartir enlace funciona
- [ ] 2FA funciona correctamente
- [ ] Revocación de autorización funciona

#### Profesional
- [ ] Escaneo de QR funciona
- [ ] Validación 2FA funciona
- [ ] Creación de entrada funciona
- [ ] Formularios validan correctamente
- [ ] Historial de intervenciones se muestra

#### General
- [ ] Navegación entre pantallas fluida
- [ ] Botones responden correctamente
- [ ] Loading states se muestran
- [ ] Errores se manejan graciosamente
- [ ] No hay crashes en flujos principales

### Dispositivos
- [ ] Testeado en iPhone reciente
- [ ] Testeado en iPhone antiguo (iOS mínimo soportado)
- [ ] Testeado en Android reciente
- [ ] Testeado en Android antiguo (API mínimo soportado)
- [ ] Testeado en tablet (opcional)
- [ ] Diferentes tamaños de pantalla verificados

### Performance
- [ ] App inicia en < 3 segundos
- [ ] Transiciones son suaves (60fps)
- [ ] No hay fugas de memoria
- [ ] Uso de batería es razonable
- [ ] Uso de datos es razonable

## 📝 Legal y Compliance

### Documentos Legales
- [ ] Términos y Condiciones escritos
- [ ] Política de Privacidad escrita
- [ ] Aviso Legal redactado
- [ ] Consentimiento GDPR/LOPD implementado

### Compliance
- [ ] GDPR cumplido (si aplica en Europa)
- [ ] LOPD cumplido (si aplica en España)
- [ ] Derecho al olvido implementado
- [ ] Exportación de datos implementada
- [ ] Notificación de brechas planificada

### Stores
- [ ] Content rating apropiado
- [ ] Categorías seleccionadas
- [ ] Edad mínima configurada
- [ ] Contacto de soporte visible

## 🚀 Build y Despliegue

### Configuración EAS
```bash
# eas.json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.glowtrack.com"
      }
    }
  }
}
```

- [ ] Archivo `eas.json` configurado
- [ ] Perfil de producción configurado
- [ ] Secrets configurados en EAS

### iOS Build
- [ ] Certificado de Apple Developer activo
- [ ] Provisioning Profile creado
- [ ] App ID registrado
- [ ] Build ejecutado: `eas build --platform ios --profile production`
- [ ] Build descargado y testeado
- [ ] TestFlight configurado
- [ ] Beta testers invitados
- [ ] Feedback de beta incorporado

### Android Build
- [ ] Keystore generado y guardado seguro
- [ ] Build ejecutado: `eas build --platform android --profile production`
- [ ] APK/AAB descargado y testeado
- [ ] Internal testing en Google Play configurado
- [ ] Beta testers invitados
- [ ] Feedback de beta incorporado

## 📱 Publicación en Stores

### App Store (iOS)

#### App Store Connect
- [ ] App creada en App Store Connect
- [ ] Bundle ID configurado
- [ ] Screenshots subidos (todos los tamaños)
- [ ] Descripción completa
- [ ] Keywords optimizados
- [ ] Categoría principal y secundaria
- [ ] Content rating completado
- [ ] Información de contacto
- [ ] URL de privacidad
- [ ] URL de soporte

#### Review
- [ ] Build subido desde EAS o Transporter
- [ ] Version notes escritas
- [ ] App enviada a revisión
- [ ] Notas de revisión para Apple incluidas
- [ ] Contacto de emergencia proporcionado

### Google Play (Android)

#### Google Play Console
- [ ] App creada en Play Console
- [ ] Package name configurado
- [ ] Screenshots subidos (todos los tamaños)
- [ ] Gráfico de funciones (1024x500px)
- [ ] Icono de app (512x512px)
- [ ] Descripción corta y larga
- [ ] Categoría y tags
- [ ] Content rating completado
- [ ] Información de contacto
- [ ] Política de privacidad
- [ ] URL de soporte

#### Review
- [ ] AAB subido desde EAS
- [ ] Release notes escritas
- [ ] Internal testing track configurado
- [ ] Beta testing track configurado (opcional)
- [ ] Production release configurado
- [ ] App enviada a revisión

## 📊 Post-Lanzamiento

### Monitoreo
- [ ] Sentry configurado para error tracking
- [ ] Analytics configurado
- [ ] Crash reporting funcionando
- [ ] Dashboard de métricas creado
- [ ] Alertas configuradas

### Métricas a Vigilar
- [ ] Crash-free rate (target: >99%)
- [ ] App start time (target: <3s)
- [ ] API response times
- [ ] User engagement
- [ ] Conversion rates
- [ ] Authorization usage
- [ ] Entry creation rate

### Soporte
- [ ] Email de soporte configurado
- [ ] Sistema de tickets (opcional)
- [ ] FAQ documentado
- [ ] Respuestas automáticas configuradas
- [ ] Tiempo de respuesta definido

### Marketing
- [ ] Landing page publicada
- [ ] Redes sociales configuradas
- [ ] Press kit preparado
- [ ] Launch announcement preparado
- [ ] Email campaign (si aplica)

## 🔄 Mantenimiento

### Actualizaciones
- [ ] Plan de actualizaciones definido
- [ ] Changelog mantenido
- [ ] Versioning strategy documentado
- [ ] Beta testing process establecido

### Backup
- [ ] Código en repositorio remoto
- [ ] Keystore/Certificates respaldados
- [ ] Documentación respaldada
- [ ] Assets originales guardados

## ✅ Checklist Final

### Antes de Enviar a Revisión
- [ ] Todos los tests pasan
- [ ] Build de producción generado
- [ ] Build testeado en dispositivos reales
- [ ] No hay errores de console
- [ ] Performance es aceptable
- [ ] Screenshots actualizados
- [ ] Descripción revisada
- [ ] Legal documents en orden

### Día del Lanzamiento
- [ ] Backend de producción estable
- [ ] Monitoring activo
- [ ] Equipo disponible para soporte
- [ ] Plan de rollback preparado
- [ ] Comunicación a usuarios preparada

### Post-Lanzamiento Inmediato
- [ ] Monitorear crashes primeras 24h
- [ ] Revisar reviews en stores
- [ ] Responder a feedback inicial
- [ ] Analizar métricas de adopción

## 🆘 Plan de Contingencia

### Si App es Rechazada
- [ ] Revisar razón del rechazo
- [ ] Planificar correcciones
- [ ] Implementar cambios
- [ ] Re-testear
- [ ] Re-enviar

### Si Hay Bugs Críticos Post-Launch
- [ ] Proceso de hotfix definido
- [ ] Canales de comunicación claros
- [ ] Timeline de fix definido
- [ ] Plan de comunicación a usuarios

---

**Versión**: 1.0.0
**Última actualización**: Octubre 2025

**Notas**: 
- Esta checklist debe revisarse antes de cada release
- Adaptar según necesidades específicas del proyecto
- Mantener actualizada con nuevos requisitos
