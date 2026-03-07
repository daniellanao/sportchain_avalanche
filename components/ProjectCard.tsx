'use client';

import Image from 'next/image';
import Link from 'next/link';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type ProjectStatus = 'abierto' | 'proximamente' | 'completado';

export type Project = {
  id: string;
  title: string;
  location: string;
  expectedYieldPercent: number;
  image: string;
  status: ProjectStatus;
  targetGoalUsd: number;
  committedUsd: number;
  progressPercent: number;
  sportType: string;
  slug: string | null;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function statusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'abierto': return 'ABIERTO';
    case 'proximamente': return 'PRÓXIMAMENTE';
    case 'completado': return 'COMPLETADO';
  }
}

export default function ProjectCard({ project: p }: { project: Project }) {
  return (
    <div
      className="rounded-2xl p-4 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '2px solid #114488',
      }}
    >
      <div className="relative mb-4">
        <Image
          src={p.image}
          alt={p.title}
          width={400}
          height={300}
          className="rounded-xl object-cover w-full h-48"
        />
        <div className="absolute top-3 right-3">
          <span
            className="px-2 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {p.sportType.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span
            className="px-2 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor:
                p.status === 'abierto'
                  ? 'var(--color-accent-gold)'
                  : p.status === 'proximamente'
                    ? 'rgba(220, 196, 142, 0.8)'
                    : 'rgba(107, 114, 128, 0.8)',
              color: p.status === 'abierto' ? 'var(--color-primary)' : 'white',
            }}
          >
            {statusLabel(p.status)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
          style={{
            backgroundColor: 'rgba(247, 211, 122, 0.18)',
            color: 'var(--foreground)',
            minHeight: '28px',
          }}
        >
          <FontAwesomeIcon icon={faMapMarker} className="text-blue" />
          <span>{p.location}</span>
        </span>
      </div>
      <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
        {p.title}
      </h3>

      <div className="mb-1 h-[4.5rem] flex flex-col justify-center" style={{ borderTop: '1px solid rgba(220, 196, 142, 0.3)' }}>
        {p.status === 'abierto' ? (
          <>
            <div className="flex items-baseline justify-between gap-2 mb-1.5" style={{ color: 'var(--foreground)' }}>
              <span className="text-sm font-semibold">
                {formatCurrency(p.committedUsd)}
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--color-subtle-text)' }}>Comprometido</span>
              </span>
              <span className="text-xs" style={{ color: 'var(--color-subtle-text)' }}>
                Meta {formatCurrency(p.targetGoalUsd)}
              </span>
            </div>
            <div
              className="w-full h-2.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(247, 211, 122, 0.22)' }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.min(Math.max(p.progressPercent, 0), 100)}%`,
                  backgroundColor: 'var(--color-accent-gold)',
                }}
              />
            </div>
            <div className="flex justify-end mt-1.5">
              <span className="text-sm font-bold" style={{ color: 'var(--color-accent-gold)' }}>
                {p.progressPercent}% Progreso
              </span>
            </div>
          </>
        ) : (
          <div
            className="flex items-center justify-center h-full text-center text-sm font-semibold"
            style={{ color: 'var(--color-accent-gold)' }}
          >
            Próximamente
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-between pt-2 mt-auto"
        style={{ borderTop: '1px solid rgba(220, 196, 142, 0.3)' }}
      >
        <div>
          <p className="text-sm mb-1" style={{ color: 'var(--color-subtle-text)' }}>
            Rendimiento esperado
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
            {p.expectedYieldPercent}%
          </p>
        </div>
        {p.status === 'abierto' ? (
          <Link
            href={p.slug ? `/proyectos/${p.slug}` : '#'}
            className="px-6 py-3 rounded-lg text-sm font-bold text-center transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-accent-gold)',
              color: 'var(--color-primary)',
              pointerEvents: p.slug ? 'auto' : 'none',
              opacity: p.slug ? 1 : 0.7,
            }}
          >
            Más Info
          </Link>
        ) : (
          <div
            className="px-6 py-3 rounded-lg text-sm font-bold text-center"
            style={{
              backgroundColor:
                p.status === 'proximamente' ? 'rgba(247, 211, 122, 0.18)' : 'rgba(31, 41, 55, 0.65)',
              color:
                p.status === 'proximamente' ? 'var(--color-accent-gold)' : 'var(--color-subtle-text)',
              cursor: 'not-allowed',
              minWidth: 120,
            }}
          >
            {p.status === 'proximamente' ? 'Próximamente' : 'Completado'}
          </div>
        )}
      </div>
    </div>
  );
}
