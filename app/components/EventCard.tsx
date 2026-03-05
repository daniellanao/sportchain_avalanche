import Image from 'next/image';
import type { Event } from '@/data/events';

const statusLabels: Record<Event['status'], string> = {
  finalizado: 'FINALIZADO',
  en_curso: 'EN CURSO',
  proximamente: 'PRÓXIMAMENTE',
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <article
      className="rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '2px solid #114488',
      }}
    >
      <div className="relative mb-4">
        <Image
          src={event.image}
          alt={event.title}
          width={400}
          height={300}
          className="rounded-xl object-cover w-full h-48"
        />
        <div className="absolute top-3 right-3">
          <span
            className="px-2 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            {event.sport}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span
            className="px-2 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: 'rgba(18, 48, 93, 0.7)', color: '#fff' }}
          >
            {statusLabels[event.status]}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
        {event.title}
      </h3>
      <p className="mb-4 text-sm flex-1" style={{ color: 'var(--color-subtle-text)' }}>
        {event.description}
      </p>

      <div className="flex flex-wrap gap-2">
        <span
          className="px-2 py-1 rounded-full text-xs"
          style={{ backgroundColor: 'rgba(227, 194, 115, 0.18)', color: 'var(--color-primary)' }}
        >
          🏆 Ganador: {event.winner}
        </span>
        <span
          className="px-2 py-1 rounded-full text-xs"
          style={{ backgroundColor: 'rgba(227, 194, 115, 0.18)', color: 'var(--color-primary)' }}
        >
          📅 {event.date}
        </span>
      </div>
    </article>
  );
}
