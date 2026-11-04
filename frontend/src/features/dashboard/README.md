# features/dashboard

Panel general. Misma base que `features/ventas` y `features/compras`: constants / mocks / utils / services /
hooks / components / pages.

```
dashboard/
├── index.js                          exporta DashboardPage
├── pages/DashboardPage.jsx           SOLO arma la pantalla (hooks + components)
├── components/
│   ├── DashboardHeader · FiltroFechaPanel · DashboardKpis
│   ├── ChartCard · GraficaIngresos · GraficaCompras
│   ├── ProductosMasVendidos · PedidosRecientes
│   ├── ExportarReporteModal
│   └── Campo · DashboardNotificaciones   (copias locales; TODO mover a shared/)
├── hooks/
│   ├── useDashboard.js               rango de fechas, carga, agrupación de series, totales, exportar
│   ├── useExportarReporteForm.js     estado del modal "Exportar reporte"
│   ├── useColoresGrafica.js          colores de recharts salidos del tema (claro/oscuro)
│   └── useNotificaciones.js          toasts que se cierran solos
├── services/dashboardService.js      acceso a datos (hoy simula una API con los mocks)
├── constants/dashboard.constants.js  agrupación, estados, módulos exportables, altura de gráficas
├── mocks/dashboardMockData.js        datos de ejemplo + generador de la serie diaria (TEMPORAL)
└── utils/dashboardHelpers.js         funciones puras: fechas, agrupación día/semana/mes, dinero, resumen
```

## Dónde va cada cosa

| Quiero...                                        | Toco...                                         |
|--------------------------------------------------|-------------------------------------------------|
| Cambiar cuándo agrupa por día / semana / mes     | `AGRUPACION` y `MAX_DIAS_*` en constants        |
| Agregar un módulo exportable o un formato        | `MODULOS_EXPORTABLES` / `FORMATOS_EXPORTACION`  |
| Cambiar el color de una serie de las gráficas    | `hooks/useColoresGrafica.js`                    |
| Conectar la API real                             | `services/dashboardService.js` (solo el cuerpo) |
| Agregar un KPI                                   | `components/DashboardKpis.jsx`                  |

## Normas que cumple (ver shared/ui/README.md y app/theme/README.md)

- Componentes base solo desde `@shared/ui`; sin `sx` en ellos.
- Sin colores `#hex`/`rgba()` (tampoco en las gráficas ni en el toast): solo nombres del tema.
- Sin `fontSize`/`fontWeight`: solo variants de Typography (en los ejes de recharts, vía CSS del nivel `caption`).
- Dinero en pesos como número; se muestra con `formatearMoneda` (es-CO: `$319.330`).
- En `Stack` los alineados van en `sx` (MUI 9 ya no acepta `flexWrap`/`alignItems`/`justifyContent` como props).
- `KPICard` de shared/ui ganó la prop opcional `subtitle` (no cambia nada para quien no la use).
