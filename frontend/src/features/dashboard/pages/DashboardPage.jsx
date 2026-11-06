import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useDashboard } from '../hooks/useDashboard'
import { useNotificaciones } from '../hooks/useNotificaciones'
import { DashboardHeader } from '../components/DashboardHeader'
import { DashboardKpis } from '../components/DashboardKpis'
import { DashboardNotificaciones } from '../components/DashboardNotificaciones'
import { ExportarReporteModal } from '../components/ExportarReporteModal'
import { GraficaCompras } from '../components/GraficaCompras'
import { GraficaIngresos } from '../components/GraficaIngresos'
import { PedidosRecientes } from '../components/PedidosRecientes'
import { ProductosMasVendidos } from '../components/ProductosMasVendidos'

// Pantalla del Dashboard: solo une las piezas. La lógica vive en hooks/, las reglas en utils/,
// los datos en services/ y cada bloque visual en components/.
export default function DashboardPage() {
  const d = useDashboard()
  const { notificaciones, notificar } = useNotificaciones()
  const [exportarAbierto, setExportarAbierto] = useState(false)

  const exportar = async (params) => {
    try {
      await d.exportarReporte(params)
      setExportarAbierto(false)
      notificar('exito', 'Reporte generado', 'El reporte está listo para descargar')
    } catch (error) {
      notificar('error', 'No se pudo generar el reporte', error.message)
    }
  }

  const subtituloGrafica = `Vista ${d.periodo.agrupacion} — ${d.periodo.etiqueta}`
  const mensajeVacio = d.cargando ? 'Cargando pedidos…' : d.errorCarga ? 'No se pudieron cargar los datos' : 'Sin pedidos recientes'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DashboardNotificaciones notificaciones={notificaciones} />

      <DashboardHeader
        rango={d.rango}
        etiquetaRango={d.etiquetaRango}
        onAplicarRango={d.aplicarRango}
        onRestablecerRango={d.restablecerRango}
        onExportar={() => setExportarAbierto(true)}
      />

      <DashboardKpis kpis={d.kpis} totalCompras={d.totalCompras} etiquetaPeriodo={d.periodo.etiqueta} resumenPedidos={d.resumenPedidos} />

      <GraficaIngresos datos={d.serieAgrupada} subtitulo={subtituloGrafica} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' }, gap: 2 }}>
        <GraficaCompras datos={d.serieAgrupada} subtitulo={subtituloGrafica} />
        <ProductosMasVendidos productos={d.productos} />
      </Box>

      <PedidosRecientes pedidos={d.pedidos} mensajeVacio={mensajeVacio} />

      <Box component="footer" sx={{ mt: 1, py: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption">© 2026 Al Horno. Todos los derechos reservados a la institución educativa SENA</Typography>
      </Box>

      <ExportarReporteModal open={exportarAbierto} onClose={() => setExportarAbierto(false)} onExportar={exportar} />
    </Box>
  )
}
