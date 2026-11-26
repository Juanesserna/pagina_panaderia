import { useState } from 'react'
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  IconEye,
  IconEyeOff,
  IconLock,
} from '@tabler/icons-react'
import { getColors, fonts } from '@app/theme/colors'

export default function AuthField({
  name,
  label,
  auth,
  isDark = false,
  icon: Icon,
  type = 'text',
  inputProps = {},
  autoComplete,
  disabled = false,
  required = true,
  sx,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  const c = getColors(isDark)
  const isPassword = type === 'password'
  const FieldIcon = Icon || (isPassword ? IconLock : null)

  const textColor = isDark ? '#F2E9DD' : '#4A2E17'
  const mutedColor = isDark ? '#C4B5A6' : '#796655'
  const paperBg = isDark ? '#2A1D16' : '#FFFFFF'

  const error = auth.touched[name] && auth.errors[name]
  const isDisabled = disabled || auth.submitting

  return (
    <TextField
      {...props}
      name={name}
      label={label}
      type={isPassword && showPassword ? 'text' : type}
      value={auth.form[name] ?? ''}
      onChange={(event) =>
        auth.updateField(name, event.target.value)
      }
      onBlur={() => auth.touch(name)}
      onKeyDownCapture={(event) => {
        if (isDisabled || event.key !== 'Tab') return
        const target = event.target
        if (target.tagName !== 'INPUT' && target.getAttribute('role') !== 'combobox') return
        if (target.getAttribute('aria-expanded') === 'true') return
        auth.handleFieldKeyDown(event, name)
      }}
      error={Boolean(error)}
      helperText={error || ''}
      disabled={isDisabled}
      autoComplete={autoComplete}
      required={required}
      fullWidth
      size="small"
      variant="outlined"
      slotProps={{
        htmlInput: inputProps,
        input: {
          startAdornment: FieldIcon ? (
            <InputAdornment position="start">
              <FieldIcon
                size={19}
                stroke={1.7}
                color={error ? undefined : mutedColor}
              />
            </InputAdornment>
          ) : undefined,

          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                type="button"
                edge="end"
                size="small"
                disabled={isDisabled}
                aria-label={
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
                aria-pressed={showPassword}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setShowPassword((prev) => !prev)}
                sx={{ color: mutedColor }}
              >
                {showPassword
                  ? <IconEyeOff size={19} stroke={1.7} />
                  : <IconEye size={19} stroke={1.7} />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            fontFamily: fonts.sans,
            fontSize: 14,
            color: textColor,
            bgcolor: paperBg,
            borderRadius: 2,
            minHeight: 46,

            '& fieldset': {
              borderColor: c.accentSoft,
            },

            '&:hover:not(.Mui-disabled):not(.Mui-error) fieldset': {
              borderColor: c.accent,
            },

            '&.Mui-focused:not(.Mui-error) fieldset': {
              borderColor: c.accent,
            },
          },

          '& .MuiInputLabel-root': {
            fontFamily: fonts.sans,
            fontSize: 14,
            color: mutedColor,

            '&.Mui-focused:not(.Mui-error)': {
              color: c.accent,
            },
          },

          '& .MuiInputBase-input': {
            '&::placeholder': {
              color: mutedColor,
              opacity: 0.8,
            },

            // Mantiene los colores cuando el navegador
            // completa automáticamente las credenciales.
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 100px ${paperBg} inset`,
              WebkitTextFillColor: textColor,
              caretColor: textColor,
              borderRadius: 'inherit',
            },
          },

          '& .MuiFormHelperText-root': {
            fontFamily: fonts.sans,
            fontSize: 12,
            lineHeight: 1.4,
            mx: 0.5,
            mt: 0.5,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}
