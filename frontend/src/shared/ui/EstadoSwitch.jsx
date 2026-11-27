import { Switch, Stack, Typography, Tooltip } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'

// Interruptor reutilizable para los módulos administrativos.
const PillSwitch = styled(Switch)(({ theme }) => {
    const on = theme.palette.success.main
    const off = alpha(theme.palette.text.secondary, 0.35)
    const thumb = theme.palette.common.white

    return {
        width: 42,
        height: 24,
        padding: 0,

        '& .MuiSwitch-switchBase': {
            padding: 2,
            color: thumb,
            transitionDuration: '250ms',

            '&.Mui-checked': {
                color: thumb,
                transform: 'translateX(18px)',

                '& + .MuiSwitch-track': {
                    backgroundColor: on,
                    opacity: 1,
                    border: 0,
                },
            },

            '&.Mui-disabled': {
                color: thumb,

                '& .MuiSwitch-thumb': {
                    backgroundColor: thumb,
                },

                '& + .MuiSwitch-track': {
                    backgroundColor: off,
                    opacity: 1,
                },

                '&.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: on,
                    opacity: 1,
                },
            },

            '&.Mui-focusVisible .MuiSwitch-thumb': {
                boxShadow: `0 0 0 4px ${alpha(on, 0.35)}`,
            },
        },

        '& .MuiSwitch-thumb': {
            backgroundColor: thumb,
            boxSizing: 'border-box',
            width: 20,
            height: 20,
            boxShadow: `0 1px 3px ${alpha(
                theme.palette.common.black,
                0.3
            )}`,
        },

        '& .MuiSwitch-track': {
            borderRadius: 12,
            backgroundColor: off,
            opacity: 1,
            transition: theme.transitions.create(
                'background-color',
                { duration: 250 }
            ),
        },
    }
})

// El estado solo cambia cuando el componente padre
// confirma y completa la operación.
export default function EstadoSwitch({
    activo = false,
    onChange,
    nombre = '',
    disabled = false,
    motivo = '',
}) {
    return (
        <Tooltip
            title={motivo || `Cambiar estado de ${nombre}`}
        >
            <Stack
                component="span"
                direction="row"
                spacing={1.25}
                sx={{
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                }}
            >
                <PillSwitch
                    disableRipple
                    checked={activo}
                    disabled={disabled}
                    onChange={onChange}
                    slotProps={{
                        input: {
                            'aria-label': `Cambiar estado de ${nombre}`,
                        },
                    }}
                />

                <Typography
                    component="span"
                    fontSize={13}
                    fontWeight={500}
                    sx={{
                        minWidth: 52,
                        color: activo
                            ? 'success.main'
                            : 'text.secondary',
                    }}
                >
                    {activo ? 'Activo' : 'Inactivo'}
                </Typography>
            </Stack>
        </Tooltip>
    )
}