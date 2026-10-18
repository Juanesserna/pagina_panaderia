# shared/ui

Componentes base del panel administrativo. **Única fuente de verdad.**

- Importa siempre desde `@shared/ui`:  `import { Button, Modal } from '@shared/ui'`
- No crees copias de Button, Input, Select, Modal, etc. dentro de tu módulo.
- Si necesitas una variación, usa las props existentes (`sx`, `size`, `variant`...) o agrega una prop
  opcional con valor por defecto que NO cambie el aspecto actual de los demás módulos.

## Colores

**Prohibido escribir colores (`#...`, `rgba(...)`) en `features/` y en estos componentes.**
Usa los nombres del tema (ver `src/app/theme/README.md`). Si falta un color, se agrega a
`src/app/theme/colors.js` en modo claro y oscuro, no en tu componente.

## Tamaños (estándar)

**Prohibido pasar medidas (`height`, `width`, `fontSize`) por `sx` a los componentes de `shared/ui`.**
Las medidas viven en los componentes y en `tokens.js`; si hay que cambiarlas, se cambian ahí y cambian en todos los módulos.

| Para...                          | Usa                                                          |
|----------------------------------|--------------------------------------------------------------|
| Buscador de una tabla            | `<SearchInput value onChange placeholder />`                 |
| Botones junto al buscador        | `<Button size="toolbar">` (mismo alto que el buscador)       |
| Fila de tarjetas KPI             | `<KPIGrid><KPICard/>...</KPIGrid>`                           |
| Campo de un filtro de ancho fijo | `<Box sx={{ width: 140 }}><Select fullWidth .../></Box>`     |

## Tipografía

**Prohibido escribir `fontSize`, `fontWeight`, `fontFamily`, `letterSpacing` o `lineHeight` en `features/`.**
Usa los niveles (`h4`, `h6`, `body1`, `body2`, `caption`, `overline`, `metric`, `mono`): ver `src/app/theme/README.md`.
Los componentes de `shared/ui` ya los usan; para texto propio de tu pantalla usa `<Typography variant="...">`.

## Componentes

`Button`, `DataTable`, `ImageWithFallback`, `Input`, `KPICard`, `KPIGrid`, `Modal`, `Pagination`, `SearchInput`, `Select`, `StatusBadge`

## Props que existen para conservar la visual de cada módulo

| Componente   | Prop                    | Quién la necesita                                |
|--------------|-------------------------|--------------------------------------------------|
| Modal        | `showDivider`           | Ventas (línea bajo el título)                    |
| StatusBadge  | `colors="fixed"`        | Ventas (LEGADO: paleta fija con modo oscuro)     |
| StatusBadge  | `size="md"`             | Ventas (12px)                                    |
| StatusBadge  | `variant="process"`     | Ventas (estado "en proceso")                     |
| DataTable    | `sortable`, `onSort`    | Ventas (columnas ordenables)                     |
| Input        | `size="sm"`             | Alto estándar de barra (ver tokens.js), 12px     |
| Button       | `size="toolbar"`        | Botones junto al buscador (alto estándar)        |
| Input        | `disabled`, `rightIcon` | Compras (campos bloqueados con candado)          |
| Button       | `fullWidth`             | Ventas, Producción                               |
| Button/Input/Select/Modal | `sx`       | Instancias puntuales (tamaños, no colores)       |
