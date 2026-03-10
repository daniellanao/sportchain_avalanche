'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/lib/supabase/client';

export type TransactionRow = {
  id: string;
  project_id: string;
  project_title: string;
  project_location: string | null;
  transaction_type: string;
  category: string;
  amount_usd: number;
  tx_hash: string | null;
  transaction_date: string;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' });

const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;

function actionLabel(transaction_type: string, category: string): string {
  if ((transaction_type || '').toLowerCase() === 'expense') return 'Pago reclamado';
  if ((category || '').toLowerCase() === 'investment') return 'Inversión';
  return transaction_type || category || '—';
}

/** For the user: income = money out (negative), expense = money in (positive). */
function signedAmount(transaction_type: string, amount_usd: number): { text: string; isPositive: boolean } {
  const isExpense = (transaction_type || '').toLowerCase() === 'expense';
  const sign = isExpense ? '+' : '-';
  const absAmount = Math.abs(Number(amount_usd) || 0);
  return {
    text: `${sign}${formatCurrency(absAmount)}`,
    isPositive: isExpense,
  };
}

export interface TransactionsTableProps {
  profileId: string | null;
  /** When this value changes, the table refetches (e.g. after a payout claim). */
  refetchTrigger?: unknown;
}

export default function TransactionsTable({ profileId, refetchTrigger }: TransactionsTableProps) {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

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
          .from('transactions')
          .select('id, project_id, transaction_type, category, amount_usd, tx_hash, transaction_date, projects(title, location)')
          .eq('profile_id', profileId)
          .order('transaction_date', { ascending: false });

        if (cancelled) return;
        if (fetchError) {
          setRows([]);
          return;
        }
        type ProjectRef = { title?: string; location?: string | null } | { title?: string; location?: string | null }[] | null;
        const list = (data ?? []) as unknown as {
          id: string;
          project_id: string;
          transaction_type: string | null;
          category: string | null;
          amount_usd: number;
          tx_hash: string | null;
          transaction_date: string;
          projects?: ProjectRef;
        }[];
        setRows(
          list.map((row) => {
            const p = row.projects;
            const single = Array.isArray(p) ? p[0] : p;
            const title = single && typeof single === 'object' && 'title' in single ? (single as { title?: string }).title ?? 'Proyecto' : 'Proyecto';
            const location = single && typeof single === 'object' && 'location' in single ? (single as { location?: string | null }).location ?? null : null;
            return {
              id: row.id,
              project_id: row.project_id,
              project_title: title,
              project_location: location ?? null,
              transaction_type: row.transaction_type ?? '',
              category: row.category ?? '',
              amount_usd: Number(row.amount_usd) || 0,
              tx_hash: row.tx_hash,
              transaction_date: row.transaction_date,
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

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
        Historial de Transacciones
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl" style={{ color: 'var(--color-accent-gold)' }} />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center" style={{ color: 'var(--color-subtle-text)' }}>
            No hay transacciones aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(220, 196, 142, 0.3)' }}>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Fecha
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Proyecto
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Acción
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Monto
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>
                    Hash de Transacción
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const { text: amountText, isPositive } = signedAmount(row.transaction_type, row.amount_usd);
                  return (
                    <tr
                      key={row.id}
                      style={{ borderBottom: index < rows.length - 1 ? '1px solid rgba(220, 196, 142, 0.2)' : 'none' }}
                    >
                      <td className="py-4 px-6" style={{ color: 'var(--foreground)' }} title={formatDateTime(row.transaction_date)}>
                        {formatDate(row.transaction_date)}
                      </td>
                      <td className="py-4 px-6 font-medium" style={{ color: 'var(--foreground)' }}>
                        <div>{row.project_title}</div>
                        {row.project_location != null && row.project_location !== '' && (
                          <div className="text-xs mt-1" style={{ color: 'var(--color-subtle-text)' }}>
                            {row.project_location}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: row.transaction_type?.toLowerCase() === 'expense' ? 'rgba(227, 194, 115, 0.18)' : 'rgba(18, 48, 93, 0.15)',
                            color: row.transaction_type?.toLowerCase() === 'expense' ? 'var(--color-accent-gold)' : 'var(--color-primary)',
                          }}
                        >
                          {actionLabel(row.transaction_type, row.category)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold" style={{ color: isPositive ? 'var(--color-accent-gold)' : 'var(--foreground)' }}>
                        {amountText}
                      </td>
                      <td className="py-4 px-6">
                        {row.tx_hash ? (
                          <a
                            href={`https://snowtrace.io/tx/${row.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm hover:underline"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            <span style={{ fontFamily: 'monospace' }}>{truncateHash(row.tx_hash)}</span>
                            <FontAwesomeIcon icon={faLink} className="text-xs" />
                          </a>
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--color-subtle-text)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
