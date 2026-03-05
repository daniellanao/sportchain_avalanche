import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import EventUpcomingCard, { type UpcomingEvent } from '@/components/EventUpcomingCard';
import { events, upcomingEvent } from '@/data/events';

export const metadata: Metadata = {
  title: 'SportChain | Eventos',
  description: 'Eventos organizados por SportChain. Torneos, entrenamientos, partidos sueltos.',
  keywords: ['eventos deportivos', 'torneos pádel', 'torneos fútbol', 'competiciones', 'deportes', 'pádel', 'fútbol', 'sportchain', 'eventos', 'entrenamientos', 'partidos sueltos'],
  openGraph: {
    title: 'Eventos | SportChain',
    description: 'Eventos organizados por SportChain. Torneos, entrenamientos, partidos sueltos.',
    url: 'https://sportchain.io/eventos',
    images: [
      {
        url: '/sportchain_og.png',
        width: 1200,
        height: 630,
        alt: 'Eventos SportChain - Torneos y competiciones',
      },
    ],
  },
  twitter: {
    title: 'Eventos | SportChain',
    description: 'Eventos organizados por SportChain. Torneos, entrenamientos, partidos sueltos.',
    images: ['/sportchain_og.jpg'],
  },
  alternates: {
    canonical: '/eventos',
  },
};

export default function EventosPage() {
  return (
    <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />

      <section className="mb-16 px-4">
        <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--foreground)' }}>
          Próximo evento
        </h2>
        <div className="max-w-6xl mx-auto w-full md:w-1/2 lg:w-1/2">
          <EventUpcomingCard event={upcomingEvent as UpcomingEvent} />
        </div>
      </section>

      <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--foreground)' }}>
        Eventos Finalizados
      </h2>

      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
