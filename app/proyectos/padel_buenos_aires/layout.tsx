import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SportChain - Complejo de Padel Buenos Aires',
  description: 'Invierte en el complejo de pádel en Buenos Aires. Rendimiento esperado del 20% anual.',
  keywords: ['padel buenos aires', 'inversión deportiva', 'complejo padel', 'sportchain'],
};

export default function PadelBuenosAiresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

