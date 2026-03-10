'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Project } from '@/components/ProjectCard';
import { createClient } from '@/lib/supabase/client';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

type ProjectRow = {
  id: string;
  title: string;
  image_url: string | null;
  location: string | null;
  sport: string | null;
  status: string | null;
  amount_target_usd: number;
  amount_committed_usd: number | null;
  amount_collected_usd: number | null;
  yield_expected_percent: number | null;
  progress_committed_percent: number | null;
  progress_collected_percent: number | null;
  slug: string | null;
};

const DEFAULT_IMAGE = '/proyectos/mvp_padel_court.png';

function normalizeStatus(s: string | null): Project['status'] {
  if (!s) return 'proximamente';
  const lower = s.toLowerCase();
  if (lower === 'abierto' || lower === 'open') return 'abierto';
  if (lower === 'completado' || lower === 'completed' || lower === 'cerrado') return 'completado';
  return 'proximamente';
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    location: row.location ?? '',
    expectedYieldPercent: Number(row.yield_expected_percent) || 0,
    image: row.image_url || DEFAULT_IMAGE,
    status: normalizeStatus(row.status),
    targetGoalUsd: Number(row.amount_target_usd) || 0,
    committedUsd: Number(row.amount_committed_usd) || 0,
    progressPercent: Number(row.progress_committed_percent) ?? 0,
    collectedUsd: Number(row.amount_collected_usd) || 0,
    progressCollectedPercent: Number(row.progress_collected_percent) ?? 0,
    sportType: row.sport ?? 'Deporte',
    slug: row.slug,
  };
}

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('id, title, image_url, location, sport, status, amount_target_usd, amount_committed_usd, amount_collected_usd, yield_expected_percent, progress_committed_percent, progress_collected_percent, slug')
          .eq('active', true)
          .order('created_at', { ascending: true });

        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
          setProjects([]);
          return;
        }
        setProjects((data ?? []).map(rowToProject));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          Todos los proyectos
        </h2>
        <div className="rounded-xl overflow-hidden flex items-center justify-center py-12" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl" style={{ color: 'var(--color-accent-gold)' }} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          Todos los proyectos
        </h2>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
        Proyectos para invertir
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(220, 196, 142, 0.3)' }}>
                <th className="text-left py-3 px-4 text-sm font-semibold w-20" style={{ color: 'var(--color-subtle-text)' }}></th>
                <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Proyecto</th>
                
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Meta</th>
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}> Recaudado</th>
                <th className="text-right py-3 px-4 text-sm font-semibold group" style={{ color: 'var(--color-primary)', position: 'relative' }}>
                  % 
                  <span className="ml-1 align-middle cursor-help relative group">
                    <FontAwesomeIcon icon={faInfoCircle} className="inline w-3 h-3 text-gray-400" />                    
                    <span className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap z-20 hidden group-hover:inline px-2 py-1 text-xs rounded shadow bg-gray-800 text-white" style={{ top: '100%' }}>
                      Porcentaje recaudado
                    </span>
                  </span>
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>ROI</th>
                <th className="text-center py-3 px-4 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Más info</th>
                <th className="text-center py-3 px-4 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Invertir</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, index) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: index < projects.length - 1 ? '1px solid rgba(220, 196, 142, 0.2)' : 'none' }}
                >
                  <td className="py-3 px-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(220, 196, 142, 0.1)' }}>
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>{p.title} 
                    <div className="text-xs text-gray-500 mt-1">{p.location}</div>
                  </td>
                  
                  <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>{formatCurrency(p.targetGoalUsd)}</td>
                  <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>{formatCurrency(p.collectedUsd)}</td>
                  <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--color-primary)' }}>{p.progressCollectedPercent}%</td>
                  <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--color-accent-gold)' }}>{p.expectedYieldPercent}%</td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={p.slug ? `/proyectos/${p.slug}` : '#'}
                      className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                      style={{
                        backgroundColor: 'rgba(18, 68, 136, 0.15)',
                        color: 'var(--color-primary)',
                        pointerEvents: p.slug ? 'auto' : 'none',
                        opacity: p.slug ? 1 : 0.6,
                      }}
                    >
                      Más info
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.status === 'abierto' && p.slug ? (
                      <Link
                        href={`/invertir/${p.slug}`}
                        className="inline-block px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:opacity-90"
                        style={{
                          backgroundColor: 'var(--color-accent-gold)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        Invertir
                      </Link>
                    ) : (
                      <span
                        className="inline-block px-4 py-2 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed"
                        style={{
                          backgroundColor: 'rgba(247, 211, 122, 0.18)',
                          color: 'var(--color-subtle-text)',
                        }}
                      >
                        Invertir
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
