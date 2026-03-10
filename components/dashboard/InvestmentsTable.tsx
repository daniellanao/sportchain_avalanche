'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from '@/components/ConfirmationModal';

const DEFAULT_IMAGE = '/proyectos/mvp_padel_court.png';

function generateFakeTxHash(): string {
  const hex = '0123456789abcdef';
  let s = '0x';
  for (let i = 0; i < 64; i++) s += hex[Math.floor(Math.random() * 16)];
  return s;
}

export type ProfileInvestmentRow = {
  id: string;
  project_id: string;
  project_title: string;
  project_image_url: string | null;
  project_location: string | null;
  status: string | null;
  total_invested_usd: number;
  total_pending_payout_usd: number;
  total_paid_usd: number;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export interface InvestmentsTableProps {
  profileId: string | null;
  /** When this value changes, the table refetches (e.g. after a new payment confirmation). */
  refetchTrigger?: unknown;
  /** Called after a payout is successfully claimed (so parent can refetch transactions, metrics, etc.). */
  onPayoutClaimed?: () => void;
}

export default function InvestmentsTable({ profileId, refetchTrigger, onPayoutClaimed }: InvestmentsTableProps) {
  const [rows, setRows] = useState<ProfileInvestmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [payoutConfirmation, setPayoutConfirmation] = useState<{ amount: number; projectTitle: string } | null>(null);

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      setRows([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('profile_investments')
          .select('id, project_id, status, total_invested_usd, total_pending_payout_usd, total_paid_usd, projects(title, image_url, location)')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false });

        if (cancelled) return;
        if (fetchError) {
          setRows([]);
          return;
        }
        type ProjectRef = { title?: string; image_url?: string | null; location?: string | null } | { title?: string; image_url?: string | null; location?: string | null }[] | null;
        const list = (data ?? []) as unknown as {
          id: string;
          project_id: string;
          status: string | null;
          total_invested_usd: number | null;
          total_pending_payout_usd: number | null;
          total_paid_usd: number | null;
          projects?: ProjectRef;
        }[];
        setRows(
          list.map((row) => {
            const p = row.projects;
            const single = Array.isArray(p) ? p[0] : p;
            const title = single?.title ?? 'Proyecto';
            const image_url = single && typeof single === 'object' && 'image_url' in single ? (single as { image_url?: string | null }).image_url : null;
            const location = single && typeof single === 'object' && 'location' in single ? (single as { location?: string | null }).location : null;
            return {
              id: row.id,
              project_id: row.project_id,
              project_title: title,
              project_image_url: image_url ?? null,
              project_location: location ?? null,
              status: row.status,
              total_invested_usd: Number(row.total_invested_usd) || 0,
              total_pending_payout_usd: Number(row.total_pending_payout_usd) || 0,
              total_paid_usd: Number(row.total_paid_usd) || 0,
            };
          })
        );
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profileId, refetchTrigger]);

  const handleClaim = async (row: ProfileInvestmentRow) => {
    if (row.total_pending_payout_usd <= 0 || !profileId) return;
    setClaimingId(row.id);
    try {
      const supabase = createClient();
      const amount = row.total_pending_payout_usd;
      const { error: txError } = await supabase.from('transactions').insert({
        project_id: row.project_id,
        profile_id: profileId,
        transaction_type: 'expense',
        category: 'payout',
        amount_usd: amount,
        wallet_from: null,
        wallet_to: null,
        tx_hash: generateFakeTxHash(),
        description: `Pago reclamado: ${row.project_title}`,
        status: 'completed',
      });
      if (txError) {
        alert(`Error al registrar el pago: ${txError.message}`);
        return;
      }
      const { error: updateError } = await supabase
        .from('profile_investments')
        .update({
          total_pending_payout_usd: 0,
          total_paid_usd: row.total_paid_usd + amount,
        })
        .eq('id', row.id);
      if (updateError) {
        alert(`Error al actualizar inversión: ${updateError.message}`);
        return;
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? { ...r, total_pending_payout_usd: 0, total_paid_usd: r.total_paid_usd + amount }
            : r
        )
      );
      setPayoutConfirmation({ amount, projectTitle: row.project_title });
      onPayoutClaimed?.();
    } finally {
      setClaimingId(null);
    }
  };

  const isActive = (status: string | null) => (status ?? 'active').toLowerCase() === 'active';

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
        Mis Inversiones
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl" style={{ color: 'var(--color-accent-gold)' }} />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center" style={{ color: 'var(--color-subtle-text)' }}>
            Aún no tienes inversiones. Invierte en un proyecto desde la tabla de abajo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(220, 196, 142, 0.3)' }}>
                  <th className="text-left py-3 px-4 text-sm font-semibold w-20" style={{ color: 'var(--color-subtle-text)' }}>
                    Imagen
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Proyecto
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Monto Invertido
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Estado
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Tokens
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Pagos por Cobrar
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Pagos Recibidos
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: index < rows.length - 1 ? '1px solid rgba(220, 196, 142, 0.2)' : 'none' }}
                  >
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'rgba(220, 196, 142, 0.1)' }}>
                        <Image
                          src={row.project_image_url || DEFAULT_IMAGE}
                          alt={row.project_title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium" style={{ color: 'var(--foreground)' }}>
                      <div>{row.project_title}</div>
                      {row.project_location != null && row.project_location !== '' && (
                        <div className="text-xs mt-1" style={{ color: 'var(--color-subtle-text)' }}>
                          {row.project_location}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right" style={{ color: 'var(--foreground)' }}>
                      {formatCurrency(row.total_invested_usd)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: isActive(row.status) ? 'rgba(227, 194, 115, 0.18)' : 'rgba(107, 114, 128, 0.18)',
                          color: isActive(row.status) ? 'var(--color-accent-gold)' : 'var(--color-subtle-text)',
                        }}
                      >
                        {isActive(row.status) ? (
                          <>
                            <FontAwesomeIcon icon={faCheckCircle} /> Activo
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faClock} /> Pendiente
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right" style={{ color: 'var(--foreground)' }}>
                      {Math.floor(row.total_invested_usd / 100)}
                    </td>
                    <td className="py-4 px-6 text-right" style={{ color: 'var(--color-accent-gold)' }}>
                      {formatCurrency(row.total_pending_payout_usd)}
                    </td>
                    <td className="py-4 px-6 text-right" style={{ color: 'var(--color-accent-gold)' }}>
                      {formatCurrency(row.total_paid_usd)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleClaim(row)}
                        disabled={claimingId === row.id || row.total_pending_payout_usd === 0}
                        className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {claimingId === row.id ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Reclamando...
                          </>
                        ) : (
                          'Reclamar Pago'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationModal
        open={payoutConfirmation !== null}
        onClose={() => setPayoutConfirmation(null)}
        title="Pago reclamado"
        message="Tu pago fue procesado correctamente."
        details={
          payoutConfirmation
            ? [
                { label: 'Monto', value: formatCurrency(payoutConfirmation.amount) },
                { label: 'Proyecto', value: payoutConfirmation.projectTitle },
              ]
            : []
        }
      />
    </section>
  );
}
