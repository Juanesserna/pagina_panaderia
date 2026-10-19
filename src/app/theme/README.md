# Tema y colores

**Fuente de verdad:** `colors.js` (modo claro y oscuro) → `theme.js` (nombres que usa MUI).
En un componente NUNCA se escribe un color: se escribe el **nombre** y el tema elige el valor
según el modo claro/oscuro. Por eso ya no hace falta `isDark ? '#...' : '#...'`.

## Chuleta (para `sx`)

| Si quieres...                              | Escribe                                              |
|--------------------------------------------|------------------------------------------------------|
| Fondo de la página                         | `bgcolor: 'background.default'`                      |
| Fondo de tarjetas, modales, paneles        | `bgcolor: 'background.paper'`                        |
| Fondo beige (campos, hover de fila, chips) | `bgcolor: 'background.alt'`                          |
| Bordes y líneas divisorias                 | `borderColor: 'divider'`                             |
| Texto principal                            | `color: 'text.primary'`                              |
| Texto secundario                           | `color: 'text.secondary'`                            |
| Texto atenuado (contadores, vacíos)        | `color: 'text.dim'`                                  |
| Color de marca / acento / foco             | `'primary.main'` (hover: `'primary.dark'`)           |
| Éxito / alerta / error / información       | `'success.main'`, `'warning.main'`, `'error.main'`, `'info.main'` |
| Fondo suave de un color (12 %)             | `bgcolor: (t) => alpha(t.palette.success.main, 0.12)` (`import { alpha } from '@mui/material/styles'`) |

## Si necesitas un color que no está

1. Agrégalo a `lightColors` y `darkColors` en `colors.js` (los dos).
2. Exponlo en `theme.js` dentro de `palette`.
3. Documéntalo en la tabla de arriba.

No lo escribas en tu componente. ESLint avisa cuando aparece un `#hex` o `rgba()` en `features/`.

## Los campos (Input, Select)

El estilo base de los campos vive en `theme.js` (`MuiOutlinedInput`, `MuiSelect`) y en `shared/ui`.
Para cambiar cómo se ven TODOS los campos, se edita ahí, no en cada pantalla.

---

# Tipografía

La fuente (Inter) ya la aplica el tema a toda la app: **no escribas `fontFamily`** (ni `fonts.sans`).
Los títulos `h1`–`h4` usan la fuente serif automáticamente.
Tamaño, peso y color del texto se eligen con un **nivel**, no con números.

## Los niveles (para `<Typography variant="...">` o `sx={{ typography: '...' }}`)

| Uso                                         | Nivel       | Tamaño | Peso | Color por defecto  |
|---------------------------------------------|-------------|--------|------|--------------------|
| Título de página                            | `h4`        | 28 px (serif) | 400 | texto principal |
| Título de sección                           | `h5`        | 18 px  | 600  | texto principal    |
| Título de modal o panel                     | `h6`        | 16 px  | 700  | texto principal    |
| **Texto principal**                         | `body1`     | 13 px  | 400  | texto principal    |
| **Texto secundario**                        | `body2`     | 12 px  | 400  | `text.secondary`   |
| Texto pequeño, ayudas, fechas               | `caption`   | 11 px  | 400  | `text.secondary`   |
| Etiquetas, encabezados de tabla, títulos de KPI | `overline` | 11 px, MAYÚSCULAS | 600 | `text.secondary` |
| Cifra grande de un KPI                      | `metric`    | 22 px  | 700  | texto principal    |
| Códigos, ids, números de documento          | `mono`      | 12 px (monoespaciada) | 400 | texto principal |
| Botones                                     | `button`    | 13 px  | 600  | (lo pone `Button`) |

Ejemplos:

```jsx
<Typography variant="h4">Ventas</Typography>
<Typography variant="body2">Gestiona los pedidos y su estado</Typography>
<Typography variant="overline">Estado</Typography>
<Box sx={{ typography: 'mono' }}>#2851</Box>
```

## Color del texto

| Para...                      | Usa                       |
|------------------------------|---------------------------|
| Texto normal                 | `text.primary`            |
| Texto de apoyo               | `text.secondary`          |
| Texto muy tenue (vacíos, placeholders) | `text.dim`      |
| Enlaces o resaltados         | `primary.main`            |
| Errores / éxito / alertas    | `error.main` / `success.main` / `warning.main` |

## Equivalencias para migrar lo que ya está escrito

| Si hoy tienes `fontSize`... | Cámbialo por |
|-----------------------------|--------------|
| 10, 10.5, 11, 11.5          | `caption` (u `overline` si va en mayúsculas) |
| 12, 12.5                    | `body2` |
| 13, 13.5, 14                | `body1` |
| 15, 16                      | `h6` |
| 18, 20                      | `h5` |
| 22                          | `metric` |

Pesos: en vez de `fontWeight` sueltos, deja que lo ponga el nivel. Si necesitas un peso aparte, solo `'fontWeightSemiBold'`.

## Si necesitas un nivel nuevo

Se agrega en `theme.js` (`typography`) y a esta tabla. No se resuelve con `fontSize` en tu componente.
