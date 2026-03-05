'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectCard, { type Project } from '../components/ProjectCard';
import { createClient } from '@/lib/supabase/client';

/** DB row from public.projects */
type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  sport: string | null;
  status: string | null;
  amount_target_usd: number;
  amount_committed_usd: number | null;
  amount_collected_usd: number | null;
  minimum_investment_usd: number | null;
  yield_expected_percent: number | null;
  project_life_years: number | null;
  progress_committed_percent: number | null;
  progress_collected_percent: number | null;
  active: boolean | null;
  slug: string | null;
  created_at: string | null;
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
    sportType: row.sport ?? 'Deporte',
    slug: row.slug,
  };
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError(null);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: true });

        if (fetchError) {
          setError(fetchError.message);
          setProjects([]);
          return;
        }
        setProjects((data ?? []).map(rowToProject));
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <h1 className="text-4xl font-bold mb-4 text-center text-blue">Proyectos de inversión</h1>
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {loading ? (
        <section className="pb-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 animate-pulse"
                  style={{ backgroundColor: 'var(--color-surface)', border: '2px solid #114488' }}
                >
                  <div className="w-full h-48 rounded-xl bg-gray-300/20 mb-4" />
                  <div className="h-6 bg-gray-300/20 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-300/20 rounded w-1/2 mb-4" />
                  <div className="h-2 bg-gray-300/20 rounded w-full mb-2" />
                  <div className="h-10 bg-gray-300/20 rounded w-1/3 mt-4" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
      <section className="pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
