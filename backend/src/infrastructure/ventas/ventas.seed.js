// Datos semilla (migrados desde frontend/features/ventas/mocks). TEMPORAL: se reemplaza por una base de datos real.

// Canal de la venta: "pagina" | "encargo" | "presencial"
// pagoUnico: true = un solo pago del 100% · false = dos abonos del 50% (solo aplica a "encargo")
export const initialVentas = [
  { id: "#2851", usuario: "María López", origen: "pagina", canal: "pagina", pagoUnico: true, nit: "1085822412", productos: 5, total: 285.0, estado: "completado", fecha: "20/06/2026", hora: "09:42", metodo: "tarjeta" },
  { id: "#2850", usuario: "Carlos Ruiz", origen: "pagina", canal: "presencial", pagoUnico: true, nit: "1014942603", productos: 1, total: 520.0, estado: "en proceso", fecha: "20/06/2026", hora: "09:35", metodo: "efectivo" },
  { id: "#2849", usuario: "Ana García", origen: "pagina", canal: "pagina", pagoUnico: true, nit: "1003356886", productos: 4, total: 160.0, estado: "completado", fecha: "20/06/2026", hora: "09:18", metodo: "tarjeta" },
  { id: "#2848", usuario: "José Martínez", origen: "pagina", canal: "encargo", pagoUnico: false, nit: "1099529223", productos: 8, total: 340.0, estado: "pendiente", fecha: "20/06/2026", hora: "09:05", metodo: "transferencia" },
  { id: "#2847", usuario: "Laura Sánchez", origen: "pagina", canal: "presencial", pagoUnico: true, nit: "1036913810", productos: 2, total: 185.0, estado: "completado", fecha: "20/06/2026", hora: "08:52", metodo: "efectivo" },
  { id: "#2846", usuario: "Pedro Flores", origen: "pagina", canal: "pagina", pagoUnico: true, nit: "1032868828", productos: 12, total: 210.0, estado: "cancelado", fecha: "20/06/2026", hora: "08:40", metodo: "tarjeta" },
  { id: "#2845", usuario: "Sofía Torres", origen: "pagina", canal: "encargo", pagoUnico: true, nit: "1029958838", productos: 3, total: 430.0, estado: "completado", fecha: "19/06/2026", hora: "17:22", metodo: "tarjeta" },
  { id: "#2844", usuario: "Diego Romero", origen: "pagina", canal: "presencial", pagoUnico: true, nit: "1018728463", productos: 6, total: 780.0, estado: "completado", fecha: "19/06/2026", hora: "16:55", metodo: "efectivo" },
  { id: "#2843", usuario: "Valentina Cruz", origen: "pagina", canal: "pagina", pagoUnico: true, nit: "1098847493", productos: 2, total: 95.0, estado: "completado", fecha: "19/06/2026", hora: "16:12", metodo: "transferencia" },
  { id: "#2842", usuario: "Rodrigo Vega", origen: "pagina", canal: "encargo", pagoUnico: false, nit: "1013756669", productos: 4, total: 620.0, estado: "en proceso", fecha: "19/06/2026", hora: "15:44", metodo: "tarjeta" },
  { id: "#2841", usuario: "Isabella Mora", origen: "pagina", canal: "presencial", pagoUnico: true, nit: "1090825067", productos: 7, total: 355.0, estado: "completado", fecha: "19/06/2026", hora: "14:30", metodo: "efectivo" },
  { id: "#2840", usuario: "Mateo Silva", origen: "pagina", canal: "pagina", pagoUnico: true, nit: "1099410741", productos: 1, total: 890.0, estado: "pendiente", fecha: "19/06/2026", hora: "13:20", metodo: "transferencia" },
];

// TODO: este usuario debe venir de features/auth, no del mock de ventas.
export const usuarioAutenticado = {
  nombre: "Andrea Gómez",
  nit: "1020304050",
};

export const catalogoClientes = [
  { nit: "1085822412", nombre: "María López" },
  { nit: "1014942603", nombre: "Carlos Ruiz" },
  { nit: "1003356886", nombre: "Ana García" },
  { nit: "1099529223", nombre: "José Martínez" },
  { nit: "1036913810", nombre: "Laura Sánchez" },
  { nit: "NN", nombre: "Cliente no identificado (NN)" },
];

export const catalogoPanaderia = [
  { nombre: "Pan francés", precio: 8.5 },
  { nombre: "Croissant", precio: 12.0 },
  { nombre: "Pan integral", precio: 15.0 },
  { nombre: "Torta de chocolate", precio: 45.0 },
  { nombre: "Empanada de pollo", precio: 18.0 },
  { nombre: "Muffin de arándano", precio: 14.0 },
  { nombre: "Baguette", precio: 10.0 },
  { nombre: "Donut glaseado", precio: 9.0 },
  { nombre: "Pan dulce", precio: 7.5 },
  { nombre: "Galletas de avena", precio: 6.0 },
  { nombre: "Cupcake de vainilla", precio: 16.0 },
  { nombre: "Pan de yema", precio: 11.0 },
];

// Genera líneas de detalle simuladas para ventas que no traen "items".
function generarProductosVenta(venta) {
  const seed = parseInt(venta.id.replace("#", ""), 10) || 0;
  const numLineas = Math.max(1, Math.min(venta.productos, (seed % 4) + 1));
  const lineas = [];
  let restante = venta.productos;

  for (let i = 0; i < numLineas; i++) {
    const producto = catalogoPanaderia[(seed + i * 3) % catalogoPanaderia.length];
    const esUltima = i === numLineas - 1;
    const cantidad = esUltima ? restante : Math.max(1, Math.round(restante / (numLineas - i)));
    lineas.push({ nombre: producto.nombre, cantidad, precio: producto.precio });
    restante -= cantidad;
  }
  return lineas;
}

export const obtenerProductosVenta = (venta) => venta.items ?? generarProductosVenta(venta);
