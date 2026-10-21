import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { IconPlus } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'
// Botón estándar del panel
import { Button } from '@shared/ui'
// Hook con la lógica de la tabla de receta
import useRecetaTabla from './receta/useRecetaTabla'
// Estilos compartidos de las celdas
import { HEADER_SX, CELL_SX } from './comunes/tablaEstilos'
// Etiqueta del encabezado de la tabla
import HeaderLabel from './comunes/HeaderLabel'
// Fila de solo lectura de un insumo
import InsumoRow from './receta/InsumoRow'
// Fila editable para agregar o editar un insumo
import EditableRow from './receta/EditableRow'

export default function RecetaTabla({
  insumos = [],
  onAgregarInsumo,
  onEditInsumo,
  onDeleteInsumo,
  mostrarEncabezado = true,
  showActions = true,
  codigoProducto,
}) {
  const theme = useTheme()
  // Toda la lógica (estados, catálogos y handlers) vive en el hook
  const {
    agregandoFila,
    editandoFilaId,
    nuevaFila,
    filaEditando,
    insumosCatalogo,
    unidadesMedida,
    loading,
    handleAgregarClick,
    handleEditarClick,
    handleChange,
    handleConfirmar,
    handleCancelar,
  } = useRecetaTabla({ onAgregarInsumo, onEditInsumo, codigoProducto })

  return (
    <>
      {mostrarEncabezado && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 20,
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Receta del Producto
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: 13,
              color: theme.palette.text.secondary,
            }}
          >
            Insumos necesarios para la elaboración de este producto
          </Typography>
        </Box>
        <Button leftIcon={<IconPlus size={16} />} onClick={handleAgregarClick}>
          Agregar insumo
        </Button>
      </Box>
      )}

      <TableContainer
        sx={{
          borderRadius: 2,
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.ahSurface2 }}>
              <TableCell sx={HEADER_SX} style={{ width: 120 }}>
                <HeaderLabel>ID PRODUCTO</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 160 }}>
                <HeaderLabel>ID INSUMO / INSUMO</HeaderLabel>
              </TableCell>
              <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 100 }}>
                <HeaderLabel>CANTIDAD</HeaderLabel>
              </TableCell>
              <TableCell sx={HEADER_SX} style={{ width: 140 }}>
                <HeaderLabel>UNIDAD DE MEDIDA</HeaderLabel>
              </TableCell>
              {showActions && (
                <TableCell sx={{ ...HEADER_SX, textAlign: 'right' }} style={{ width: 100 }}>
                  <HeaderLabel>ACCIONES</HeaderLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {insumos.length === 0 && !agregandoFila && editandoFilaId === null ? (
              <TableRow>
                <TableCell colSpan={showActions ? 5 : 4} align="center" sx={{ ...CELL_SX, py: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: 13,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Aún no se han agregado insumos a la receta.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {insumos.map((i) => (
                  editandoFilaId === i.id ? (
                    <EditableRow
                      key={i.id}
                      fila={filaEditando}
                      onChange={handleChange}
                      onConfirm={handleConfirmar}
                      onCancel={handleCancelar}
                      insumosCatalogo={insumosCatalogo}
                      unidadesMedida={unidadesMedida}
                      loading={loading}
                      showActions={showActions}
                      isNew={false}
                    />
                  ) : (
                    <InsumoRow
                      key={i.id}
                      insumo={i}
                      onEdit={handleEditarClick}
                      onDelete={onDeleteInsumo}
                      showActions={showActions}
                    />
                  )
                ))}
                {agregandoFila && (
                  <EditableRow
                    fila={nuevaFila}
                    onChange={handleChange}
                    onConfirm={handleConfirmar}
                    onCancel={handleCancelar}
                    insumosCatalogo={insumosCatalogo}
                    unidadesMedida={unidadesMedida}
                    loading={loading}
                    showActions={showActions}
                    isNew={true}
                  />
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}