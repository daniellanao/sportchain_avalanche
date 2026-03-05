export type EventStatus = 'finalizado' | 'en_curso' | 'proximamente';

export type Event = {
  id: string;
  title: string;
  sport: string;
  status: EventStatus;
  description: string;
  winner: string;
  date: string;
  image: string;
  /** Optional CTA for upcoming events (e.g. "Inscribirse en Luma") */
  cta?: { label: string; href: string };
};

/** Single upcoming event for the top section (Aleph Padel Tournament) */
export const upcomingEvent: Event = {
  id: 'aleph-padel-march26',
  title: 'Aleph Padel Tournament',
  sport: 'PÁDEL',
  status: 'proximamente',
  description:
    'Una jornada de deporte, competencia y reencuentro de la comunidad de Crecimiento.',
  winner: '',
  date: '25 de Marzo 2026',
  image: '/eventos/aleph_padel_tournament.jpg',
  cta: { label: 'Más info y registro en Luma', href: 'https://luma.com/padel_aleph_march26' },
};

export const events: Event[] = [
  {
    id: 'padel-web3-8',
    title: 'Padel Tournament for Startups & Web3 8.0',
    sport: 'PÁDEL',
    status: 'finalizado',
    description:
      'Último torneo de pádel con 16 participantes en 2025, reuniendo a founders, startups y entusiastas del deporte en una gran jornada de networking y diversión.',
    winner: 'Rafa & Dani',
    date: '13 de Diciembre 2025',
    image: '/eventos/sportchain_padel_tournament_8.jpg',
  },
  {
    id: 'padel-devconnect',
    title: 'Padel DevConnect Tournament',
    sport: 'PÁDEL',
    status: 'finalizado',
    description: 'Torneo de pádel previo al DevConnect 2025.',
    winner: 'Nico & Tommy',
    date: '16 de Noviembre 2025',
    image: '/eventos/sportchain_padel_devconnect.jpg',
  },
  {
    id: 'padel-web3-7',
    title: 'Padel Tournament for Startups & Web3 7.0',
    sport: 'PÁDEL',
    status: 'finalizado',
    description:
      '¡Regresó el torneo friendly de pádel y diversión! Súmate a este tipo de eventos donde podrás conocer a otros startups y founders.',
    winner: 'Nico & Vicente',
    date: '12 de Octubre 2025',
    image: '/eventos/sportchain_padel_tournament_7.jpg',
  },
  {
    id: 'padel-experience',
    title: 'Padel Experience',
    sport: 'PÁDEL',
    status: 'finalizado',
    description:
      'Una experiencia única de padel y networking, donde los participantes disfrutaron de partidos amistosos, entrenamiento y un ambiente relajado para conectar con otros entusiastas del deporte y la tecnología.',
    winner: 'Rony & Seba',
    date: '28 de Setiembre 2025',
    image: '/eventos/sportchain_padel_experience.jpg',
  },
  {
    id: 'padel-web3-6',
    title: 'Padel Tournament for Startups & Web3 6.0',
    sport: 'PÁDEL',
    status: 'finalizado',
    description: 'Un torneo emocionante que reunió a 16 personas en una tarde de diversion y networking.',
    winner: 'Emperadores',
    date: '07 de Setiembre 2025',
    image: '/eventos/sportchain_padel_tournament_6.jpg',
  },
  {
    id: 'padel-web3-5',
    title: 'Padel Tournament for Startups & Web3 5.0',
    sport: 'PÁDEL',
    status: 'finalizado',
    description: 'Un torneo emocionante que reunió a 16 personas en una tarde de diversion y networking.',
    winner: 'Iluminados & Mentores',
    date: '24 de Agosto 2025',
    image: '/eventos/sportchain_padel_tournament_5.jpg',
  },
  {
    id: 'padel-vcs-4',
    title: 'Padel Tournament for Startups & VCs 4.0',
    sport: 'PÁDEL',
    status: 'finalizado',
    description: '2do torneo de Pádel organizado por SportChain, con 16 participantes.',
    winner: 'Elevadores',
    date: '10 de Agosto 2025',
    image: '/eventos/sportchain_padel_tournament_4.jpg',
  },
  {
    id: 'padel-vcs-3',
    title: 'Padel Tournament for Startups & VCs 3.0',
    sport: 'PÁDEL',
    status: 'finalizado',
    description: 'Primer Torneo de Pádel organizado por SportChain, con 16 participantes.',
    winner: 'Backspin Brothers',
    date: '27 Julio 2025',
    image: '/eventos/sportchain_padel_tournament_3.jpg',
  },
];
