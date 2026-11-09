import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { useColoresGrafica } from '../hooks/useColoresGrafica'
import { formatearMoneda } from '../utils/dashboardHelpers'
import { ChartCard } from './ChartCard'

export function GraficaCompras({ datos, subtitulo }) {
  const c = useColoresGrafica()
  return (
    <ChartCard title="Compras" subtitle={subtitulo}>
      <BarChart data={datos}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.rejilla} />
        <XAxis dataKey="name" tick={{ fill: c.eje }} stroke={c.rejilla} />
        <YAxis tick={{ fill: c.eje }} stroke={c.rejilla} />
        <Tooltip {...c.tooltip} formatter={(valor) => formatearMoneda(valor)} />
        <Bar dataKey="compras" name="Compras" radius={[4, 4, 0, 0]} fill={c.compras} />
      </BarChart>
    </ChartCard>
  )
}
