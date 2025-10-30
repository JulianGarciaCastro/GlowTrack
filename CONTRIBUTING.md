# Guía de Contribución - Glow Track

Gracias por tu interés en contribuir a Glow Track. Este documento proporciona las directrices para contribuir al proyecto.

## Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de la participación en este proyecto una experiencia libre de acoso para todos, independientemente de la edad, tamaño corporal, discapacidad, etnia, identidad y expresión de género, nivel de experiencia, nacionalidad, apariencia personal, raza, religión o identidad y orientación sexual.

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor:

1. Verifica que no esté ya reportado en [Issues](../../issues)
2. Crea un nuevo issue con:
   - Título descriptivo
   - Pasos para reproducir
   - Comportamiento esperado vs. actual
   - Screenshots si es aplicable
   - Versión de la app y plataforma (iOS/Android)

### Proponer Features

Para proponer nuevas funcionalidades:

1. Verifica que no exista una propuesta similar
2. Crea un issue con etiqueta "enhancement"
3. Describe claramente:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas
   - Mockups o ejemplos (si aplica)

### Pull Requests

#### Proceso

1. Fork el proyecto
2. Crea una rama desde `develop`:
   ```bash
   git checkout -b feature/amazing-feature
   # o
   git checkout -b fix/bug-description
   ```

3. Realiza tus cambios siguiendo las convenciones de código

4. Escribe o actualiza tests según sea necesario

5. Asegúrate de que todos los tests pasen:
   ```bash
   npm test
   ```

6. Verifica el linting:
   ```bash
   npm run lint
   ```

7. Commit tus cambios usando commits descriptivos:
   ```bash
   git commit -m "feat: add amazing feature"
   # o
   git commit -m "fix: resolve issue with calendar"
   ```

8. Push a tu fork:
   ```bash
   git push origin feature/amazing-feature
   ```

9. Abre un Pull Request contra la rama `develop`

#### Convenciones de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan el código)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplos:
```
feat: add QR code scanner for professional authorization
fix: resolve calendar date selection issue
docs: update API integration guide
style: format professional screens with prettier
refactor: extract medication form into separate component
test: add unit tests for auth service
chore: update dependencies to latest versions
```

## Estándares de Código

### TypeScript

```typescript
// ✅ Bueno - Tipado explícito
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Malo - Usar any
function getUser(id: any): any {
  // ...
}
```

### React Components

```typescript
// ✅ Bueno - Functional components con TypeScript
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

// ❌ Malo - Sin tipos
export const Button = ({ title, onPress, disabled }) => {
  // ...
};
```

### Nomenclatura

- **Componentes**: PascalCase (`CalendarScreen`, `QRGenerator`)
- **Funciones**: camelCase (`getUserProfile`, `formatDate`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Archivos**: 
  - Componentes: PascalCase (`MonthCalendar.tsx`)
  - Utilidades: camelCase (`formatters.ts`)
  - Tipos: camelCase con index (`types/index.ts`)

### Estructura de Archivos

```typescript
// 1. Imports externos
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// 2. Imports internos (relativos)
import { useAuth } from '../../services/auth';
import { apiClient } from '../../sdk/api';

// 3. Imports de tipos
import { Entry, EntryType } from '../../types';

// 4. Constantes
const MAX_ENTRIES = 100;

// 5. Tipos/Interfaces locales
interface ScreenProps {
  navigation: any;
}

// 6. Componente
export const MyScreen: React.FC<ScreenProps> = ({ navigation }) => {
  // ...
};

// 7. Estilos
const styles = StyleSheet.create({
  // ...
});
```

### Comentarios

```typescript
// ✅ Bueno - Comentarios útiles
/**
 * Validates patient authorization token with optional 2FA
 * @param token - Authorization token from QR code
 * @param twoFactorCode - Optional 2FA code
 * @returns Authorization details if valid
 */
async function validateAuthorization(token: string, twoFactorCode?: string) {
  // ...
}

// ❌ Malo - Comentarios obvios
// Set the name
setName(name);
```

## Testing

### Escribir Tests

Todo código nuevo debe incluir tests apropiados:

```typescript
// MyComponent.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);
    
    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Cobertura de Tests

- Funciones críticas: 100%
- Componentes UI: >80%
- Servicios/Utils: >90%

## Documentación

### Actualizar README

Si tu cambio afecta el uso de la app, actualiza el README.md con:
- Nuevas funcionalidades
- Cambios en instalación/configuración
- Nuevas dependencias

### JSDoc

Documenta funciones públicas con JSDoc:

```typescript
/**
 * Formats a date to a localized string
 * @param date - Date to format
 * @param format - Format string (default: "dd/MM/yyyy")
 * @returns Formatted date string
 * @example
 * formatDate(new Date(), 'dd-MM-yyyy')
 * // => "29-10-2025"
 */
export function formatDate(date: Date, format = 'dd/MM/yyyy'): string {
  // ...
}
```

## Revisión de Código

### Checklist del Revisor

- [ ] El código cumple con los estándares del proyecto
- [ ] Los tests pasan exitosamente
- [ ] No hay console.logs sin necesidad
- [ ] Las funciones tienen tipos apropiados
- [ ] Los componentes son reutilizables cuando es posible
- [ ] La documentación está actualizada
- [ ] No hay información sensible hardcodeada
- [ ] El código es eficiente y no tiene fugas de memoria

### Checklist del Autor

Antes de solicitar revisión:

- [ ] He probado los cambios localmente
- [ ] He ejecutado los tests y todos pasan
- [ ] He ejecutado el linter sin errores
- [ ] He actualizado la documentación
- [ ] He agregado tests para nuevo código
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He hecho commits descriptivos

## Comunicación

### Canales

- **Issues**: Para bugs y features
- **Pull Requests**: Para revisión de código
- **Email**: development@glowtrack.com para temas generales

### Tiempo de Respuesta

- Issues: 48 horas
- Pull Requests: 72 horas
- Preguntas generales: 1 semana

## Licencia

Al contribuir, aceptas que tus contribuciones se licenciarán bajo la misma licencia del proyecto.

---

¡Gracias por contribuir a Glow Track! 🎉
