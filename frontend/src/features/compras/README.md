# features/compras

Módulo de órdenes de compra. Sigue la misma base que `features/ventas` (constants / mocks / utils) y la
estructura estándar de los módulos (pages / components / hooks / services).

```
compras/
├── index.js                       exporta ComprasPage
├── pages/ComprasPage.jsx          SOLO arma la pantalla (hooks + components). Sin lógica de negocio
├── components/                    piezas visuales; todo viene de '@shared/ui', nada de copias locales
│   ├── ComprasKpis · ComprasToolbar · FiltrosComprasPanel · ComprasTable
│   ├── NuevaCompraModal (+ ItemCompraForm) · EditarCompraModal · DetalleCompraModal
│   ├── CambiarEstadoModal · EliminarCompraModal
│   └── Campo (etiqueta + control) · CompraNotificaciones (toasts)
├── hooks/
│   ├── useCompras.js              carga, búsqueda, filtros, orden, paginación, KPIs y operaciones
│   ├── useNuevaCompraForm.js      estado del formulario "Nueva orden de compra"
│   └── useNotificaciones.js       toasts que se cierran solos
├── services/comprasService.js     acceso a datos (hoy simula una API con los mocks)
├── constants/compras.constants.js estados, variantes, categorías, PAGE_SIZE, filtros vacíos
├── mocks/comprasMockData.js       datos de ejemplo (TEMPORAL: se borra al conectar la API)
└── utils/comprasHelpers.js        funciones puras: reglas, fechas, dinero, filtros, orden, KPIs
```

## Dónde va cada cosa

| Quiero...                                   | Toco...                                              |
|---------------------------------------------|------------------------------------------------------|
| Agregar/cambiar un estado o una categoría   | `constants/compras.constants.js`                     |
| Cambiar una regla (transición de estado...) | `utils/comprasHelpers.js`                            |
| Conectar la API real                        | `services/comprasService.js` (solo el cuerpo)        |
| Cambiar cómo se ve una pieza                | el archivo de `components/` correspondiente          |
| Agregar un filtro                           | `filtrosVacios` + `filtrarCompras` + `FiltrosComprasPanel` |

## Normas que cumple (ver shared/ui/README.md y app/theme/README.md)

- Componentes base solo desde `@shared/ui`; sin `sx` en ellos (anchos con un `Box` alrededor).
- Sin colores `#hex`/`rgba()`: solo nombres del tema. Sin `fontSize`/`fontWeight`: solo variants de Typography.
- Dinero en pesos como número; el formato (`$45.000`) se aplica al mostrar con `formatearMoneda`.
- En `Stack` los alineados van en `sx` (MUI 9 ya no acepta `flexWrap`/`alignItems`/`justifyContent` como props).
