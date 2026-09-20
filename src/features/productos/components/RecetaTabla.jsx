import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { IconCirclePlus, IconPencil, IconTrash } from '@tabler/icons-react'
import { fonts } from '@app/theme/colors'

const HEADER_SX = {
  padding: '12px 16px',
  backgroundColor: 'transparent',
  borderBottom: 'none',
}

const CELL_SX = {
  padding: '12px 16px',
}

function HeaderLabel({ children }) {
  const theme = useTheme()
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: fonts.sans,
        fontSize: 11,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: theme.palette.text.secondary,
      }}
    >
      {children}
    </Typography>
  )
}

function InsumoRow({ insumo, onEdit, onDelete, showActions }) {
  const theme = useTheme()
  return (
    <TableRow sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.idProducto}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {`${insumo.idInsumo} / ${insumo.insumo}`}
        </Typography>
      </TableCell>
      <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.cantidad}
        </Typography>
      </TableCell>
      <TableCell sx={CELL_SX}>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: 13, color: theme.palette.text.primary }}>
          {insumo.unidad}
        </Typography>
      </TableCell>
      {showActions && (
        <TableCell sx={{ ...CELL_SX, textAlign: 'right' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
            <Button
              size="small"
              onClick={onEdit}
              sx={{
                color: theme.palette.text.secondary,
                width: 28,
                height: 28,
                minWidth: 28,
              }}
            >
              <IconPencil size={15} />
            </Button>
            <Button
              size="small"
              onClick={onDelete}
              sx={{
                color: theme.palette.error.main,
                width: 28,
                height: 28,
                minWidth: 28,
              }}
            >
              <IconTrash size={15} />
            </Button>
          </Box>
        </TableCell>
      )}
    </TableRow>
  )
}

export default function RecetaTabla({
  insumos = [],
  onAgregarInsumo,
  onEditInsumo,
  onDeleteInsumo,
  mostrarEncabezado = true,
  showActions = true,
}) {
  const theme = useTheme()

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
        <Button
          variant="contained"
          color="primary"
          startIcon={<IconCirclePlus size={16} />}
          onClick={onAgregarInsumo}
          sx={{
            textTransform: 'none',
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            flexShrink: 0,
          }}
        >
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
            <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
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
            {insumos.length === 0 ? (
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
              insumos.map((i) => (
                <InsumoRow
                  key={i.id}
                  insumo={i}
                  onEdit={onEditInsumo}
                  onDelete={onDeleteInsumo}
                  showActions={showActions}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
