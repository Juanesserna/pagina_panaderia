// Acceso a datos del módulo "dashboard".
// HOY: simula una API con los datos de mocks/ (async).
// MAÑANA: se cambia SOLO el cuerpo de estas funciones por fetch/axios; los hooks y las pantallas no cambian.
import { generarSerieDiaria, kpisMock, pedidosRecientes, productosMasVendidos } from '../mocks/dashboardMockData'

const clonar = (valor) => structuredClone(valor)

export const dashboardService = {
  async obtenerKpis() {
    return clonar(kpisMock)
  },

  async obtenerPedidosRecientes() {
    return clonar(pedidosRecientes)
  },

  async obtenerProductosMasVendidos() {
    return clonar(productosMasVendidos)
  },

  // [{ date, ventas, compras }] un registro por día del rango
  async obtenerSerieDiaria({ start, end }) {
    return generarSerieDiaria(start, end)
  },

  // params: { fechaInicio, fechaFin, modulos, formato }
  // TODO: hoy solo simula la generación; con la API real devuelve/descarga el archivo.
  async exportarReporte({ modulos }) {
    if (!modulos || modulos.length === 0) throw new Error('Selecciona al menos un módulo')
    return { ok: true }
  },
}
