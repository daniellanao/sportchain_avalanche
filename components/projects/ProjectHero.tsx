'use client';

import Image from 'next/image';

export type ProjectHeroData = {
  title: string;
  location: string;
  description: string;
  image: string;
  status: string; // 'abierto' | 'proximamente' | etc
  targetGoalUsd: number;
  committedUsd: number;
  progressPercent: number;
  expectedYieldPercent: number;
  projectLifeYears: number | null;
  minimumInvestmentUsd: number;
  sportType: string;
  slug?: string;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

function statusLabel(status: string) {
  const s = status?.toLowerCase();
  if (s === 'abierto') return 'Abierto a invertir';
  if (s === 'proximamente' || s === 'próximamente') return 'Próximamente';
  return status;
}

function statusTone(status: string) {
  const s = status?.toLowerCase();
  if (s === 'abierto') return { bg: 'var(--color-accent-gold)', fg: 'var(--color-primary)' };
  return { bg: 'rgba(255,255,255,0.08)', fg: 'var(--foreground)' };
}

type ProjectHeroProps = {
  project: ProjectHeroData;
  onInvestClick?: () => void;
};

export default function ProjectHero({ project, onInvestClick }: ProjectHeroProps) {
  const pct = Math.min(Math.max(project.progressPercent ?? 0, 0), 100);
  const years = project.projectLifeYears ?? 3;
  const status = statusLabel(project.status);
  const tone = statusTone(project.status);

  const ctaText =
    project.status?.toLowerCase() === 'abierto'
      ? 'Estoy interesado en invertir'
      : 'Quiero que me avisen cuando abra';

  return (
    <section className="relative pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Title, Investment card, Description */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: tone.bg, color: tone.fg }}
              >
                {status.toUpperCase()}
              </span>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {project.sportType.toUpperCase()}
              </span>
            </div>

            {/* Title + location */}
            <h1 className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              {project.title}
            </h1>
            <p className="text-sm md:text-base mb-2" style={{ color: 'var(--color-subtle-text)' }}>
              {project.location}
            </p>

            {/* Row 1: Expected yield + progress bar */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                {/* Expected Yield box - left (50%) */}
                <div
                  className="w-full md:w-1/2 flex flex-col justify-center items-center rounded-xl border-2 p-4 md:p-4"
                  style={{
                    borderColor: '#114488',
                    backgroundColor: 'var(--color-surface)',
                    minHeight: '140px',
                  }}
                >
                  <p
                    className="text-base md:text-lg font-semibold mb-1"
                    style={{ color: 'var(--color-subtle-text)' }}
                  >
                    Rentabilidad esperada
                  </p>
                  <p
                    className="text-4xl md:text-5xl font-extrabold mb-1"
                    style={{ color: 'var(--color-accent-gold)', letterSpacing: '-1px' }}
                  >
                    {project.expectedYieldPercent}%
                  </p>
                  <span
                    className="text-base md:text-lg font-semibold mb-2"
                    style={{ color: 'var(--color-subtle-text)' }}
                  >
                    Anual
                  </span>
                </div>

                {/* Progress box - right (50%), same structure as yield box */}
                <div
                  className="w-full md:w-1/2 flex flex-col justify-center rounded-xl border-2 p-4 md:p-4"
                  style={{
                    borderColor: '#114488',
                    backgroundColor: 'var(--color-surface)',
                    minHeight: '140px',
                  }}
                >
                  <p
                    className="text-base md:text-lg font-semibold mb-1 text-center"
                    style={{ color: 'var(--color-subtle-text)' }}
                  >
                    Progreso de compromisos
                  </p>
                  <p
                    className="text-4xl md:text-5xl font-extrabold mb-1 text-center"
                    style={{ color: 'var(--color-accent-gold)', letterSpacing: '-1px' }}
                  >
                    {pct}%
                  </p>
                  <span
                    className="text-base md:text-lg font-semibold mb-3 text-center block"
                    style={{ color: 'var(--color-subtle-text)' }}
                  >
                    {formatCurrency(project.committedUsd)} / {formatCurrency(project.targetGoalUsd)}
                  </span>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(220, 196, 142, 0.18)' }}>
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: 'var(--color-accent-gold)',
                      }}
                    />
                  </div>
                </div>
              </div>
              
            </div>

            {/* Row 2: Meta, Horizon, Min ticket */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border-2 border-blue-900 rounded-xl p-4 flex flex-col items-center">
                <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--color-subtle-text)' }}>
                  Meta
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                  {formatCurrency(project.targetGoalUsd)}
                </p>
              </div>
              <div className="border-2 border-blue-900 rounded-xl p-4 flex flex-col items-center">
                <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--color-subtle-text)' }}>
                  Horizonte
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                  {years} años
                </p>
              </div>
              <div className="border-2 border-blue-900 rounded-xl p-4 flex flex-col items-center">
                <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--color-subtle-text)' }}>
                  Ticket mínimo
                </p>
                <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                  Desde {formatCurrency(project.minimumInvestmentUsd)}
                </p>
              </div>
            </div>

            {/* Row 3: CTA */}
            {onInvestClick && (
              <div className="mb-6">
                <button
                  onClick={onInvestClick}
                  className="btn-gold px-8 py-4 rounded-xl text-base md:text-lg font-bold cursor-pointer"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {ctaText}
                </button>
              </div>
            )}

            {/* Description */}
            {project.description && (
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--foreground)' }}>
                {project.description}
              </p>
            )}
          </div>

          {/* RIGHT: Image */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="relative h-72 sm:h-80 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.25))' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}