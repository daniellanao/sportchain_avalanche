import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Hero from './components/home/Hero';
import MisionVision from './components/home/MisionVision';
import Roadmap from './components/home/Roadmap';
import Community from './components/home/Community';


export const metadata: Metadata = {
  title: 'SportChain | Inicio',
  description: 'Plataforma para invertir y recibir ganancias mediante instalaciones deportivas.',
  keywords: ['sportchain',  'inversión deportiva', 'complejos deportivos',
     'latinoamérica', 'deportes', 'pádel', 'fútbol', 'tenis', 'entrenamientos', 'partidos sueltos'],
  openGraph: {
    title: 'SportChain | Inicio',
    description: 'Plataforma para invertir y recibir ganancias mediante instalaciones deportivas en toda Latinoamérica.',
    url: 'https://sportchain.io',
    images: [
      {
        url: '/sportchain_og.png',
        width: 1200,
        height: 630,
        alt: 'SportChain - Tokenización Deportiva',
      },
    ],
  },
  twitter: {
    title: 'SportChain | Inicio',
    description: 'Plataforma para invertir y recibir ganancias mediante instalaciones deportivas en toda Latinoamérica.',
    images: ['/sportchain_og.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <Hero />
      <MisionVision />    
      <Roadmap />
      <Community />
    </main>
  );
}
