import { useState } from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { IconLock, IconPlus } from '@tabler/icons-react'
import { Button, Input, Modal, Select } from '@shared/ui'
import { useNuevaCompraForm } from '../hooks/useNuevaCompraForm'
import { formatearMoneda, opcionesProveedor } from '../utils/comprasHelpers'
import { Campo } from './Campo'
import { ItemCompraForm } from './ItemCompraForm'

// El formulario se monta cada vez que el modal abre, así siempre arranca limpio.
function NuevaCompraForm({ compras, proveedores, insumos, solicitanteInicial, onConfirmar, onInvalido, onClose, onCrearProveedor, onCrearInsumo }) {
  const f = useNuevaCompraForm({ compras, proveedores, insumos, solicitanteInicial })
  const [modalProveedor, setModalProveedor] = useState(false)
  const [formProveedor, setFormProveedor] = useState({ nombre: '', nit: '', nombreContacto: '', telefono: '', email: '', direccion: '', estado: true })
  const [modalInsumo, setModalInsumo] = useState({ abierto: false, idx: null })
  const [formInsumo, setFormInsumo] = useState({ nombre: '', idCategoria: '', idUnidadMedida: '', stockMinimo: '', estado: true })

  const categoriasInsumo = [
    { id: 1, nombre: 'Harinas y Cereales' },
    { id: 2, nombre: 'Lácteos y Grasas' },
    { id: 3, nombre: 'Endulzantes y Azúcares' },
    { id: 4, nombre: 'Levaduras y Leudantes' },
    { id: 5, nombre: 'Esencias y Especias' },
  ]
  const unidadesInsumo = [
    { id: 1, abreviatura: 'kg', nombre: 'Kilogramo' },
    { id: 2, abreviatura: 'g', nombre: 'Gramo' },
    { id: 3, abreviatura: 'L', nombre: 'Litro' },
    { id: 4, abreviatura: 'ml', nombre: 'Mililitro' },
    { id: 5, abreviatura: 'und', nombre: 'Unidad' },
  ]

  const confirmar = () => {
    if (!f.esValido) {
      onInvalido()
      return
    }
    onConfirmar(f.construir())
  }

  const setProv = (campo, valor) => setFormProveedor((p) => ({ ...p, [campo]: valor }))

  const guardarProveedor = async () => {
    if (!formProveedor.nombre || !formProveedor.nit) return
    const nuevo = await onCrearProveedor?.(formProveedor)
    if (nuevo?.id) f.cambiarCampo('proveedorId', nuevo.id)
    setFormProveedor({ nombre: '', nit: '', nombreContacto: '', telefono: '', email: '', direccion: '', estado: true })
    setModalProveedor(false)
  }

  const setInsumo = (campo, valor) => setFormInsumo((p) => ({ ...p, [campo]: valor }))

  const abrirNuevoInsumo = (idx) => {
    setFormInsumo({ nombre: '', idCategoria: '', idUnidadMedida: '', stockMinimo: '', estado: true })
    setModalInsumo({ abierto: true, idx })
  }

  const guardarInsumo = async () => {
    if (!formInsumo.nombre || !formInsumo.idCategoria || !formInsumo.idUnidadMedida) return
    const unidad = unidadesInsumo.find((u) => String(u.id) === String(formInsumo.idUnidadMedida))
    const nuevo = await onCrearInsumo?.({
      nombre: formInsumo.nombre,
      unidad: unidad?.abreviatura || 'kg',
      categoria: categoriasInsumo.find((c) => String(c.id) === String(formInsumo.idCategoria))?.nombre || 'Materias primas',
    })
    if (nuevo?.nombre && modalInsumo.idx !== null) {
      f.cambiarItem(modalInsumo.idx, 'nombre', nuevo.nombre)
    }
    setModalInsumo({ abierto: false, idx: null })
  }

  return (
    <>
      {/* Cuerpo con scroll propio y footer con el total siempre visible (sin scroll horizontal) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(90vh - 112px)', minWidth: 0, overflow: 'hidden' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', pr: 1, minHeight: 0, minWidth: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          {/* Datos generales */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', xl: 'repeat(6, minmax(0, 1fr))' },
              gap: 2.25,
              alignItems: 'start',
              minWidth: 0,
              '& > *': { minWidth: 0 },
            }}
          >
            <Campo label="ID de orden" ayuda="Generado automáticamente">
              <Input value={f.meta.id} disabled rightIcon={<IconLock size={12} />} />
            </Campo>
            <Campo label="Fecha" ayuda="Fecha del sistema">
              <Input value={f.meta.fecha} disabled />
            </Campo>
            <Campo label="Número de factura">
              <Input value={f.form.numeroFactura || ''} onChange={(e) => f.cambiarCampo('numeroFactura', e.target.value)} />
            </Campo>
            <Campo label="Fecha de la factura">
              <Input type="date" value={f.form.fechaFactura || ''} onChange={(e) => f.cambiarCampo('fechaFactura', e.target.value)} />
            </Campo>
            <Campo label="Hora de facturación">
              <Input type="time" value={f.form.horaFacturacion || ''} onChange={(e) => f.cambiarCampo('horaFacturacion', e.target.value)} />
            </Campo>
            <Campo label="Proveedor">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Select
                    options={opcionesProveedor(proveedores)}
                    value={f.form.proveedorId}
                    onChange={(e) => f.cambiarCampo('proveedorId', e.target.value)}
                  />
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setModalProveedor(true)}
                  title="Nuevo proveedor"
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'background.alt',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    flexShrink: 0,
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                  }}
                >
                  <IconPlus size={16} />
                </IconButton>
              </Box>
            </Campo>
          </Box>

          {/* Productos solicitados */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.08em' }}>
                Productos solicitados
              </Typography>
              <Button variant="secondary" size="sm" leftIcon={<IconPlus size={13} />} onClick={f.agregarItem}>
                Agregar insumo
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              {f.form.items.map((item, idx) => (
                <ItemCompraForm
                  key={item.lote}
                  item={item}
                  insumos={insumos}
                  lotesAbierto={Boolean(f.lotesAbiertos[item.lote])}
                  puedeQuitar={f.form.items.length > 1}
                  onChange={(campo, valor) => f.cambiarItem(idx, campo, valor)}
                  onQuitar={() => f.quitarItem(idx)}
                  onAlternarLote={() => f.alternarLote(item.lote)}
                  onNuevoInsumo={() => abrirNuevoInsumo(idx)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer fijo: no se desplaza junto con el cuerpo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', md: 'flex-end' },
          justifyContent: 'space-between',
          gap: 2.5,
          flexWrap: 'wrap',
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: 2.5,
          mt: 2.5,
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, flexWrap: 'wrap', minWidth: 0 }}>
          <Box sx={{ width: { xs: '100%', sm: 220 }, minWidth: 0 }}>
            <Campo label="Descuento general (%)">
              <Input
                type="number"
                min={0}
                placeholder="Ej: 10"
                value={f.form.descuento || ''}
                onChange={(e) => f.cambiarCampo('descuento', Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              />
            </Campo>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 220 }, minWidth: 0 }}>
            <Campo label="IVA total ($)">
              <Input
                type="text"
                placeholder="0"
                value={f.form.ivaTotal || ''}
                onChange={(e) => f.cambiarCampo('ivaTotal', Math.max(0, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0))}
              />
            </Campo>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, pb: 0.25, minWidth: 180 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: 'text.dim' }}>
                Total a pagar
              </Typography>
              {f.totalDescontado > 0 && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'accentDim',
                    color: 'primary.main',
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'primary.main', my: 0, fontWeight: 600 }}>
                    −{formatearMoneda(f.totalDescontado)} descontado
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="h5">{formatearMoneda(f.total)}</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1.25} sx={{ ml: 'auto', flexShrink: 0 }}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" onClick={confirmar}>
            Generar orden
          </Button>
        </Stack>
      </Box>
      </Box>

      <Modal open={modalProveedor} onClose={() => setModalProveedor(false)} title="Nuevo proveedor" size="lg" showDivider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.dim', mt: -1 }}>
            Registrar nuevo proveedor en el sistema
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">Información general</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Campo label="Código">
                <Input disabled value="Se asigna al guardar" onChange={() => {}} />
              </Campo>
              <Campo label="Estado">
                <Select
                  options={[{ value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }]}
                  value={formProveedor.estado ? 'true' : 'false'}
                  onChange={(e) => setProv('estado', e.target.value === 'true')}
                />
              </Campo>
              <Campo label="Nombre empresa" required>
                <Input placeholder="Ej: Molinos El Trigal S.A." value={formProveedor.nombre} onChange={(e) => setProv('nombre', e.target.value)} />
              </Campo>
              <Campo label="NIT" required>
                <Input placeholder="900.123.456-7" value={formProveedor.nit} onChange={(e) => setProv('nit', e.target.value)} />
              </Campo>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">Contacto</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Campo label="Nombre contacto" required>
                <Input value={formProveedor.nombreContacto} onChange={(e) => setProv('nombreContacto', e.target.value)} />
              </Campo>
              <Campo label="Teléfono" required>
                <Input placeholder="+57 300 000 0000" value={formProveedor.telefono} onChange={(e) => setProv('telefono', e.target.value)} />
              </Campo>
              <Campo label="Correo electrónico" required>
                <Input type="email" placeholder="correo@empresa.com" value={formProveedor.email} onChange={(e) => setProv('email', e.target.value)} />
              </Campo>
              <Campo label="Dirección" required>
                <Input value={formProveedor.direccion} onChange={(e) => setProv('direccion', e.target.value)} />
              </Campo>
            </Box>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="ghost" size="sm" onClick={() => setModalProveedor(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setFormProveedor({ nombre: '', nit: '', nombreContacto: '', telefono: '', email: '', direccion: '', estado: true })}>
              Limpiar campos
            </Button>
            <Button variant="primary" size="sm" onClick={guardarProveedor}>
              Guardar proveedor
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal open={modalInsumo.abierto} onClose={() => setModalInsumo({ abierto: false, idx: null })} title="Nuevo insumo" size="lg" showDivider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.dim', mt: -1 }}>
            Registrar nuevo insumo en el sistema
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">Información general</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Campo label="Código">
                <Input disabled value="Se asigna al guardar" onChange={() => {}} />
              </Campo>
              <Campo label="Estado">
                <Select
                  options={[{ value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }]}
                  value={formInsumo.estado ? 'true' : 'false'}
                  onChange={(e) => setInsumo('estado', e.target.value === 'true')}
                />
              </Campo>

              <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                <Campo label="Nombre del insumo" required>
                  <Input placeholder="Ej: Harina de trigo fortificada" value={formInsumo.nombre} onChange={(e) => setInsumo('nombre', e.target.value)} />
                </Campo>
              </Box>

              <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                <Campo label="Categoría" required>
                  <Select
                    options={[
                      { value: '', label: 'Seleccionar categoría…' },
                      ...categoriasInsumo.map((c) => ({ value: c.id, label: c.nombre })),
                    ]}
                    value={formInsumo.idCategoria}
                    onChange={(e) => setInsumo('idCategoria', e.target.value ? Number(e.target.value) : '')}
                  />
                </Campo>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">Inventario</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Campo label="Unidad de medida" required>
                <Select
                  options={[
                    { value: '', label: 'Seleccionar unidad…' },
                    ...unidadesInsumo.map((u) => ({ value: u.id, label: u.abreviatura })),
                  ]}
                  value={formInsumo.idUnidadMedida}
                  onChange={(e) => setInsumo('idUnidadMedida', e.target.value ? Number(e.target.value) : '')}
                />
              </Campo>
              <Campo label="Stock mínimo" required>
                <Input type="number" min={0} value={formInsumo.stockMinimo} onChange={(e) => setInsumo('stockMinimo', e.target.value)} />
              </Campo>
            </Box>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="ghost" size="sm" onClick={() => setModalInsumo({ abierto: false, idx: null })}>
              Cancelar
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setFormInsumo({ nombre: '', idCategoria: '', idUnidadMedida: '', stockMinimo: '', estado: true })}>
              Limpiar campos
            </Button>
            <Button variant="primary" size="sm" onClick={guardarInsumo}>
              Guardar insumo
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}

export function NuevaCompraModal({ open, onClose, ...props }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva orden de compra"
      size="lg"
      showDivider
      sx={{
        maxWidth: 'min(1440px, calc(100vw - 24px))',
        width: '100%',
        m: { xs: 1, sm: 2 },
      }}
      contentSx={{ px: { xs: 2, sm: 3 }, py: 2.5, overflow: 'hidden' }}
    >
      <NuevaCompraForm onClose={onClose} {...props} />
    </Modal>
  )
}
