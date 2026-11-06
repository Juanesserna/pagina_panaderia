import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { useColoresGrafica } from '../hooks/useColoresGrafica'
import { formatearMoneda } from '../utils/dashboardHelpers'
import { ChartCard } from './ChartCard'

export function GraficaIngresos({ datos, subtitulo }) {
  const c = useColoresGrafica()
  return (
    <ChartCard title="Ingresos" subtitle={subtitulo}>
      <AreaChart data={datos}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.rejilla} />
        <XAxis dataKey="name" tick={{ fill: c.eje }} stroke={c.rejilla} />
        <YAxis tick={{ fill: c.eje }} stroke={c.rejilla} />
        <Tooltip {...c.tooltip} formatter={(valor) => formatearMoneda(valor)} />
        <Area type="monotone" dataKey="ventas" name="Ventas" stroke={c.ventas} fill={c.ventas} strokeWidth={2} fillOpacity={0.15} />
      </AreaChart>
    </ChartCard>
  )
}
