# shared/ui

Componentes base del panel administrativo. **Única fuente de verdad.**

- Importa siempre desde `@shared/ui`.
- No crees copias de Button, Input, Select, Modal, etc. dentro de tu módulo.
- Si necesitas una variación, usa las props existentes (`sx`, `size`, `variant`...) o agrega una prop
  opcional con valor por defecto que NO cambie el aspecto actual de los demás módulos.

## Props que existen para conservar la visual de cada módulo

| Componente   | Prop                 | Quién la necesita                                  |
|--------------|----------------------|----------------------------------------------------|
| Modal        | `showDivider`        | Ventas (línea bajo el título)                      |
| Pagination   | `compact`            | Producción (texto 11.5px, color secundario)        |
| StatusBadge  | `colors="fixed"`     | Ventas (paleta fija + modo oscuro + `process`)     |
| StatusBadge  | `size="md"`          | Ventas (12px)                                      |
| DataTable    | `sortable`, `onSort` | Ventas (columnas ordenables)                       |
| Button/Input/Select/Modal | `sx`    | Instancias puntuales                               |
| Button       | `fullWidth`          | Ventas, Producción                                 |
