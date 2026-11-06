import { CategoriasProvider } from '@features/categorias'
import ThemeProvider from "./ThemeProvider";

export default function AppProviders({ children }) {
  return (
    <CategoriasProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </CategoriasProvider>
  );
}
