// src/features/insumos/index.js
export { default as InsumosPage } from './pages/InsumosPage'
export { useInsumos, filtrosVacios } from './hooks/useInsumos'
export { InsumosKpis } from './components/InsumosKpis'
export { InsumosTable } from './components/InsumosTable'
export { FormularioInsumo } from './components/FormularioInsumo'
export { DetalleInsumo } from './components/DetalleInsumo'
export { FiltrosInsumosPanel } from './components/FiltrosInsumosPanel'
export { fetchInsumos, getUnidadesMedida } from './services/insumosService'