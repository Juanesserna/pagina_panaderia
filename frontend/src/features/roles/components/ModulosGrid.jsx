import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import {
  MODULOS,
  PRIVILEGIOS_POR_MODULO,
} from '../services/rolesService'

export default function ModulosGrid({
  modulos = [],
  privilegios = {},
  onModulosChange,
  onPrivilegiosChange,
}) {
  const [nuevoModulo, setNuevoModulo] = useState('')
  const [moduloPorEliminar, setModuloPorEliminar] = useState(null)

  const modulosDisponibles = MODULOS.filter(
    (modulo) => !modulos.includes(modulo)
  )

  const handleAgregarModulo = () => {
    if (!nuevoModulo) return

    onModulosChange([...modulos, nuevoModulo])
    onPrivilegiosChange({
      ...privilegios,
      [nuevoModulo]: [],
    })

    setNuevoModulo('')
  }

  const handleEliminarModulo = () => {
    if (!moduloPorEliminar) return

    const nuevosModulos = modulos.filter(
      (modulo) => modulo !== moduloPorEliminar
    )

    const nuevosPrivilegios = { ...privilegios }
    delete nuevosPrivilegios[moduloPorEliminar]

    onModulosChange(nuevosModulos)
    onPrivilegiosChange(nuevosPrivilegios)
    setModuloPorEliminar(null)
  }

  const handleTogglePrivilegio = (modulo, privilegioId) => {
    const actuales = privilegios[modulo] ?? []

    const nuevos = actuales.includes(privilegioId)
      ? actuales.filter((id) => id !== privilegioId)
      : [...actuales, privilegioId]

    onPrivilegiosChange({
      ...privilegios,
      [modulo]: nuevos,
    })
  }

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Box sx={{ mb: 1.2 }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700 }}>
          Módulos y privilegios
        </Typography>

        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.3 }}>
          Selecciona los módulos y las acciones que podrá realizar el rol.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <FormControl
          size="small"
          sx={{ width: { xs: '100%', sm: 260 }, maxWidth: '100%' }}
        >
          <Select
            value={nuevoModulo}
            displayEmpty
            onChange={(e) => setNuevoModulo(e.target.value)}
            renderValue={(selected) =>
              selected || (
                <Typography component="span" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                  Seleccionar módulo
                </Typography>
              )
            }
            sx={{
              height: 38,
              fontSize: '0.8rem',
              borderRadius: 1.5,
              backgroundColor: 'background.paper',
              '& .MuiSelect-select': { py: 1, px: 1.5 },
            }}
          >
            {modulosDisponibles.map((modulo) => (
              <MenuItem key={modulo} value={modulo}>
                {modulo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAgregarModulo}
          disabled={!nuevoModulo}
          sx={{
            height: 38,
            px: 2,
            whiteSpace: 'nowrap',
            textTransform: 'none',
            borderRadius: 1.5,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          Agregar módulo
        </Button>
      </Box>

      {modulos.length === 0 ? (
        <Box
          sx={{
            minHeight: 130,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'text.secondary' }}>
              No hay módulos asignados
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.5 }}>
              Selecciona un módulo para comenzar a configurar sus privilegios.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
              xl: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 1.2,
            alignItems: 'start',
          }}
        >
          {modulos.map((modulo) => {
            const opciones = PRIVILEGIOS_POR_MODULO[modulo] ?? []
            const asignados = privilegios[modulo] ?? []

            return (
              <Box
                key={modulo}
                sx={{
                  minWidth: 0,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.3,
                    py: 0.65,
                    backgroundColor: 'action.hover',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    {modulo}
                  </Typography>

                  <IconButton
                    size="small"
                    aria-label={`Quitar módulo ${modulo}`}
                    onClick={() => setModuloPorEliminar(modulo)}
                    disableRipple
                    sx={{
                      width: 27,
                      height: 27,
                      color: 'text.secondary',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        color: 'error.main',
                        backgroundColor: 'transparent',
                      },
                      '&:active': {
                        backgroundColor: 'transparent',
                      },
                      '&.Mui-focusVisible': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    columnGap: 0.5,
                    rowGap: 0.1,
                    px: 1,
                    py: 0.7,
                  }}
                >
                  {opciones.map((privilegio) => (
                    <FormControlLabel
                      key={privilegio.id}
                      control={
                        <Checkbox
                          size="small"
                          checked={asignados.includes(privilegio.id)}
                          onChange={() => handleTogglePrivilegio(modulo, privilegio.id)}
                          sx={{ p: 0.45 }}
                        />
                      }
                      label={privilegio.nombre}
                      sx={{
                        m: 0,
                        minWidth: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.69rem',
                          lineHeight: 1.2,
                          color: 'text.secondary',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )
          })}
        </Box>
      )}

      <Dialog
        open={Boolean(moduloPorEliminar)}
        onClose={() => setModuloPorEliminar(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3 } },
        }}
      >
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>
          Quitar módulo
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem' }}>
            ¿Deseas quitar el módulo <strong>{moduloPorEliminar}</strong> y todos sus privilegios asignados a este rol?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setModuloPorEliminar(null)}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleEliminarModulo}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ textTransform: 'none' }}
          >
            Quitar módulo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
