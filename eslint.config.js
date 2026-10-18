import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Colores: prohíbe #hex y rgba() escritos a mano dentro de features/
  {
    files: ['src/features/**/*.{js,jsx}'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: 'No uses colores hex. Usa nombres del tema (ej: "divider", "primary.main") o agrégalo a src/app/theme/colors.js.',
        },
        {
          selector: 'Literal[value=/^rgba?\\(/]',
          message: 'No uses rgba() directo. Usa nombres del tema o alpha(theme.palette.x.main, 0.12).',
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{js,jsx}'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: 'No uses colores hex. Usa nombres del tema (ej: "divider", "primary.main") o agrégalo a src/app/theme/colors.js.',
        },
        {
          selector: 'Literal[value=/^rgba?\\(/]',
          message: 'No uses rgba() directo. Usa nombres del tema o alpha(theme.palette.x.main, 0.12).',
        },
        {
          selector: 'JSXOpeningElement[name.name=/^(Input|Select|Button|KPICard|StatusBadge|Pagination|DataTable)$/] > JSXAttribute[name.name="sx"]',
          message: 'No uses sx en componentes de @shared/ui. Usa sus props (size, variant...), SearchInput o KPIGrid.',
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{js,jsx}'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: 'No uses colores hex. Usa nombres del tema (ej: "divider", "primary.main") o agrégalo a src/app/theme/colors.js.',
        },
        {
          selector: 'Literal[value=/^rgba?\\(/]',
          message: 'No uses rgba() directo. Usa nombres del tema o alpha(theme.palette.x.main, 0.12).',
        },
        {
          selector: 'JSXOpeningElement[name.name=/^(Input|Select|Button|KPICard|StatusBadge|Pagination|DataTable)$/] > JSXAttribute[name.name="sx"]',
          message: 'No uses sx en componentes de @shared/ui. Usa sus props (size, variant...), SearchInput o KPIGrid.',
        },
        {
          selector: 'Property[key.name=/^(fontSize|fontWeight|fontFamily|letterSpacing|lineHeight)$/]',
          message: 'No definas tipografía a mano. Usa un nivel: <Typography variant="body1|body2|caption|overline|h6...">. Ver src/app/theme/README.md.',
        },
      ],
    }
  }
])