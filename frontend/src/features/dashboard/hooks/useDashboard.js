import { useEffect, useMemo, useState } from 'react'
import { DIAS_RANGO_INICIAL, KPIS_VACIOS, agrupacionLabel } from '../constants/dashboard.constants'
import { dashboardService } from '../services/dashboardService'
import {
  agruparSerie,
  claveDeRango,
  etiquetaDeRango,
  modoAgrupacion,
  rangoUltimosDias,
  resumirPedidos,
  sumarCompras,
} from '../utils/dashboardHelpers'

// Todo el estado y la lógica del panel: rango de fechas, carga de datos, agrupación de las series,
// totales y exportación. La pantalla solo dibuja.
export function useDashboard() {
  const [rango, setRango] = useState(() => rangoUltimosDias(DIAS_RANGO_INICIAL))

  // Datos que no dependen del rango
  const [base, setBase] = useState({ kpis: KPIS_VACIOS, pedidos: [], productos: [] })
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false)

  // Serie diaria + el rango al que pertenece (así gráficas, KPI y textos siempre son coherentes entre sí,
  // incluso mientras llega la serie de un rango nuevo)
  const [serie, setSerie] = useState({ clave: null, rango: null, datos: [] })

  // ---------- Carga ----------

  useEffect(() => {
    let activo = true
    Promise.all([
      dashboardService.obtenerKpis(),
      dashboardService.obtenerPedidosRecientes(),
      dashboardService.obtenerProductosMasVendidos(),
    ])
      .then(([kpis, pedidos, productos]) => {
        if (!activo) return
        setBase({ kpis, pedidos, productos })
        setCargando(false)
      })
      .catch(() => {
        if (!activo) return
        setErrorCarga(true)
        setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const clave = claveDeRango(rango)

  useEffect(() => {
    let activo = true
    dashboardService
      .obtenerSerieDiaria(rango)
      .then((datos) => {
        if (activo) setSerie({ clave, rango, datos })
      })
      .catch(() => {
        if (activo) setErrorCarga(true)
      })
    return () => {
      activo = false
    }
  }, [rango, clave])

  // ---------- Rango de fechas ----------

  const aplicarRango = (nuevo) => setRango(nuevo)
  const restablecerRango = () => setRango(rangoUltimosDias(DIAS_RANGO_INICIAL))

  // ---------- Datos derivados ----------

  const rangoMostrado = serie.rango ?? rango
  const agrupacion = modoAgrupacion(rangoMostrado.start, rangoMostrado.end)

  const serieAgrupada = useMemo(() => agruparSerie(serie.datos, agrupacion), [serie.datos, agrupacion])
  const totalCompras = useMemo(() => sumarCompras(serieAgrupada), [serieAgrupada])
  const resumenPedidos = useMemo(() => resumirPedidos(base.pedidos), [base.pedidos])

  // ---------- Operaciones ----------

  const exportarReporte = (params) => dashboardService.exportarReporte(params)

  return {
    cargando,
    errorCarga,
    kpis: base.kpis,
    pedidos: base.pedidos,
    productos: base.productos,
    resumenPedidos,
    // rango seleccionado (lo que muestra el botón del encabezado)
    rango,
    etiquetaRango: etiquetaDeRango(rango),
    aplicarRango,
    restablecerRango,
    // datos del rango mostrado en gráficas y KPI
    periodo: { etiqueta: etiquetaDeRango(rangoMostrado), agrupacion: agrupacionLabel[agrupacion] },
    serieAgrupada,
    totalCompras,
    // operaciones
    exportarReporte,
  }
}
