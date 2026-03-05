import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SportChain | Proyectos',
  description: 'Proyectos de inversión deportiva disponibles en SportChain.',
  keywords: ['proyectos deportivos', 'inversión', 'complejos deportivos', 'pádel', 'sportchain'],
};

export default function ProyectosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
