import Image from 'next/image';

export type UpcomingEvent = {
  id: string;
  title: string;
  sport: string;
  status: string;
  description: string;
  date: string;
  image: string;
  cta: { label: string; href: string };
};

export default function EventUpcomingCard({ event }: { event: UpcomingEvent }) {
  return (
    <article
      className="rounded-2xl overflow-hidden flex flex-col md:flex-row"
      style={{
        border: '2px solid #114488',
      }}
    >
      {/* Image left - 3:4 proportion */}
      <div className="relative w-full md:w-2/5 flex-shrink-0 aspect-[3/4]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
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
            PRÓXIMAMENTE
          </span>
        </div>
      </div>

      {/* Content right */}
      <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
        <h3 className="text-2xl md:text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
          {event.title}
        </h3>
        <p className="mb-4 text-sm flex-1" style={{ color: 'var(--color-subtle-text)' }}>
          {event.description}
        </p>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span
            className="px-2 py-1 rounded-full text-xs"
            style={{ backgroundColor: 'rgba(227, 194, 115, 0.18)', color: 'var(--color-primary)' }}
          >
            📅 {event.date}
          </span>
        </div>
        <a
          href={event.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 w-fit"
          style={{
            backgroundColor: 'var(--color-accent-gold)',
            color: 'var(--color-primary)',
            boxShadow: '0 1px 6px rgba(220, 196, 142, 0.18)',
          }}
        >
          {event.cta.label}
        </a>
      </div>
    </article>
  );
}
