'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faWallet, faArrowLeft, faMapMarkerAlt, faChartLine, faBullseye, faCoins } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_IMAGE = '/proyectos/mvp_padel_court.png';

type ProjectData = {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  status: string | null;
  location: string | null;
  sport: string | null;
  image_url: string | null;
  amount_target_usd: number;
  amount_committed_usd: number | null;
  amount_collected_usd: number | null;
  minimum_investment_usd: number | null;
  yield_expected_percent: number | null;
  project_life_years: number | null;
  progress_committed_percent: number | null;
  progress_collected_percent: number | null;
  created_at: string | null;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function generateRandomWalletAddress(): string {
  const hex = '0123456789abcdef';
  let s = '0x';
  for (let i = 0; i < 40; i++) s += hex[Math.floor(Math.random() * 16)];
  return s;
}

function generateFakeTxHash(): string {
  const hex = '0123456789abcdef';
  let s = '0x';
  for (let i = 0; i < 64; i++) s += hex[Math.floor(Math.random() * 16)];
  return s;
}

export default function InvertirPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : null;
  const { user, loading: authLoading } = useAuth();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('Proyecto no especificado');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('id, title, description, slug, status, location, sport, image_url, amount_target_usd, amount_committed_usd, amount_collected_usd, minimum_investment_usd, yield_expected_percent, project_life_years, progress_committed_percent, progress_collected_percent, created_at')
          .eq('slug', slug)
          .eq('active', true)
          .maybeSingle();

        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
          setProject(null);
          return;
        }
        if (!data) {
          setError('Proyecto no encontrado');
          setProject(null);
          return;
        }
        const status = (data.status ?? '').toLowerCase();
        if (status !== 'abierto' && status !== 'open') {
          setError('Este proyecto no acepta inversiones en este momento.');
          setProject(null);
          return;
        }
        setProject({
          id: data.id,
          title: data.title,
          description: data.description,
          slug: data.slug,
          status: data.status,
          location: data.location,
          sport: data.sport,
          image_url: data.image_url,
          amount_target_usd: Number(data.amount_target_usd) || 0,
          amount_committed_usd: data.amount_committed_usd != null ? Number(data.amount_committed_usd) : null,
          amount_collected_usd: data.amount_collected_usd != null ? Number(data.amount_collected_usd) : null,
          minimum_investment_usd: data.minimum_investment_usd != null ? Number(data.minimum_investment_usd) : 100,
          yield_expected_percent: data.yield_expected_percent != null ? Number(data.yield_expected_percent) : null,
          project_life_years: data.project_life_years != null ? Number(data.project_life_years) : null,
          progress_committed_percent: data.progress_committed_percent != null ? Number(data.progress_committed_percent) : null,
          progress_collected_percent: data.progress_collected_percent != null ? Number(data.progress_collected_percent) : null,
          created_at: data.created_at,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar el proyecto');
          setProject(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const handleConnectWallet = () => {
    setWalletAddress(generateRandomWalletAddress());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !walletAddress.trim()) return;
    const amountNum = parseFloat(amount.replace(',', '.'));
    const min = project.minimum_investment_usd ?? 100;
    if (Number.isNaN(amountNum) || amountNum < min) {
      setError(`Monto mínimo: ${formatCurrency(min)}`);
      return;
    }
    if (amountNum % 100 !== 0) {
      setError('El monto debe ser un múltiplo de 100 (ej: 100, 200, 300…).');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('transactions').insert({
        project_id: project.id,
        profile_id: user?.id ?? null,
        transaction_type: 'income',
        category: 'investment',
        amount_usd: amountNum,
        wallet_from: walletAddress.trim() || null,
        wallet_to: null,
        tx_hash: generateFakeTxHash(),
        description: `Inversión en ${project.title}`,
        status: 'completed',
      });

      if (insertError) {
        setError(insertError.message || 'Error al guardar la transacción');
        return;
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(
          'sportchain_payment_confirmation',
          JSON.stringify({
            amount: amountNum,
            projectTitle: project.title,
          })
        );
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" style={{ color: 'var(--color-accent-gold)' }} />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center py-12">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4" style={{ color: 'var(--color-accent-gold)' }} />
          <p style={{ color: 'var(--color-subtle-text)' }}>Cargando proyecto…</p>
        </div>
      </main>
    );
  }

  if (error && !project) {
    return (
      <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <p className="text-lg mb-6" style={{ color: 'var(--color-subtle-text)' }}>{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
            style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary)' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al dashboard
          </Link>
        </div>
      </main>
    );
  }

  const minInvest = project?.minimum_investment_usd ?? 100;
  const imageSrc = project?.image_url || DEFAULT_IMAGE;

  return (
    <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:underline"
          style={{ color: 'var(--color-subtle-text)' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Project info */}
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-xl" style={{ border: '2px solid rgba(220, 196, 142, 0.4)' }}>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={imageSrc}
                  alt={project?.title ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {(project?.sport ?? 'Deporte').toUpperCase()}
                  </span>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-md">{project?.title}</h1>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 space-y-5" style={{ backgroundColor: 'var(--color-surface)', border: '2px solid #114488' }}>
              {project?.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{project.description}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project?.location != null && project.location !== '' && (
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(247, 211, 122, 0.12)' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" style={{ color: 'var(--color-accent-gold)' }} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-subtle-text)' }}>Lugar</p>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{project.location}</p>
                    </div>
                  </div>
                )}
                {project?.yield_expected_percent != null && (
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(247, 211, 122, 0.12)' }}>
                    <FontAwesomeIcon icon={faChartLine} className="text-lg" style={{ color: 'var(--color-accent-gold)' }} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-subtle-text)' }}>Rendimiento esperado</p>
                      <p className="font-bold text-lg" style={{ color: 'var(--color-accent-gold)' }}>{project.yield_expected_percent}%</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(247, 211, 122, 0.12)' }}>
                  <FontAwesomeIcon icon={faBullseye} className="text-lg" style={{ color: 'var(--color-accent-gold)' }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-subtle-text)' }}>Meta</p>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(project?.amount_target_usd ?? 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(247, 211, 122, 0.12)' }}>
                  <FontAwesomeIcon icon={faCoins} className="text-lg" style={{ color: 'var(--color-accent-gold)' }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-subtle-text)' }}>Recaudado</p>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{formatCurrency(project?.amount_collected_usd ?? project?.amount_committed_usd ?? 0)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2 border-t" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
                <div>
                  <span className="text-xs" style={{ color: 'var(--color-subtle-text)' }}>Progreso comprometido </span>
                  <span className="font-bold ml-1" style={{ color: 'var(--color-accent-gold)' }}>{project?.progress_committed_percent ?? 0}%</span>
                </div>
                <div>
                  <span className="text-xs" style={{ color: 'var(--color-subtle-text)' }}>Progreso recaudado </span>
                  <span className="font-bold ml-1" style={{ color: 'var(--color-accent-gold)' }}>{project?.progress_collected_percent ?? 0}%</span>
                </div>
                {project?.project_life_years != null && (
                  <div>
                    <span className="text-xs" style={{ color: 'var(--color-subtle-text)' }}>Vida del proyecto </span>
                    <span className="font-semibold ml-1" style={{ color: 'var(--foreground)' }}>{project.project_life_years} años</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl p-6 lg:p-8 shadow-xl" style={{ backgroundColor: 'var(--color-surface)', border: '2px solid #114488' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Realizar inversión</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-subtle-text)' }}>
                Monto mínimo: <strong style={{ color: 'var(--color-accent-gold)' }}>{formatCurrency(minInvest)}</strong>
                <span className="block mt-1">Solo múltiplos de 100 (ej: 100, 200, 300…)</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Monto a invertir (USD)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    min={Math.max(100, Math.ceil((minInvest || 100) / 100) * 100)}
                    step={100}
                    placeholder={formatCurrency(Math.max(100, Math.ceil((minInvest || 100) / 100) * 100))}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'rgba(220, 196, 142, 0.4)',
                      color: 'var(--foreground)',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="wallet" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    Dirección de wallet
                  </label>
                  {walletAddress ? (
                    <input
                      id="wallet"
                      type="text"
                      readOnly
                      value={walletAddress}
                      className="w-full px-4 py-3 rounded-lg border-2 font-mono text-sm"
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.08)',
                        borderColor: 'rgba(34, 197, 94, 0.4)',
                        color: 'var(--foreground)',
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={handleConnectWallet}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary)' }}
                    >
                      <FontAwesomeIcon icon={faWallet} /> Conectar wallet
                    </button>
                  )}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={!walletAddress.trim() || submitting}
                  className="w-full py-3.5 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary)' }}
                >
                  {submitting ? <><FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Procesando…</> : 'Invertir'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
