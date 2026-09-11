import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JoinOps — Sistema Operativo de Gestión Gastronómica',
  description: 'Plataforma empresarial modular de operación, control y trazabilidad gastronómica.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
