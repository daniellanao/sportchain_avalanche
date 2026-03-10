'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@/lib/supabase/client';

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export type MetricsData = {
  totalInvested: number;
  payoutsReceived: number;
  claimableBalance: number;
  returnOnInvestment: number;
};

export interface MetricsBoxesProps {
  profileId: string | null;
  /** When this value changes, metrics refetch (e.g. after payment or claim). */
  refetchTrigger?: unknown;
}

export default function MetricsBoxes({ profileId, refetchTrigger }: MetricsBoxesProps) {
  const [metrics, setMetrics] = useState<MetricsData>({
    totalInvested: 0,
    payoutsReceived: 0,
    claimableBalance: 0,
    returnOnInvestment: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      setMetrics({ totalInvested: 0, payoutsReceived: 0, claimableBalance: 0, returnOnInvestment: 0 });
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('profile_investments')
          .select('total_invested_usd, total_pending_payout_usd, total_paid_usd')
          .eq('profile_id', profileId);

        if (cancelled) return;
        if (fetchError) {
          setMetrics({ totalInvested: 0, payoutsReceived: 0, claimableBalance: 0, returnOnInvestment: 0 });
          return;
        }
        const rows = (data ?? []) as { total_invested_usd: number | null; total_pending_payout_usd: number | null; total_paid_usd: number | null }[];
        let totalInvested = 0;
        let payoutsReceived = 0;
        let claimableBalance = 0;
        for (const row of rows) {
          totalInvested += Number(row.total_invested_usd) || 0;
          payoutsReceived += Number(row.total_paid_usd) || 0;
          claimableBalance += Number(row.total_pending_payout_usd) || 0;
        }
        const returnOnInvestment =
          totalInvested > 0 ? Math.round(((payoutsReceived) / totalInvested) * 100) : 2;
        setMetrics({ totalInvested, payoutsReceived, claimableBalance, returnOnInvestment });
      } catch {
        if (!cancelled) setMetrics({ totalInvested: 0, payoutsReceived: 0, claimableBalance: 0, returnOnInvestment: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profileId, refetchTrigger]);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px]"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}
            >
              <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" style={{ color: 'var(--color-accent-gold)' }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
            Total Invertido
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            {formatCurrency(metrics.totalInvested)}
          </p>
        </div>
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
            Pagos Recibidos
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
            {formatCurrency(metrics.payoutsReceived)}
          </p>
        </div>
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
            Pagos por Cobrar
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
            {formatCurrency(metrics.claimableBalance)}
          </p>
        </div>
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
          <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
            Capital Recuperado
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
            {metrics.returnOnInvestment}%
          </p>
        </div>
      </div>
    </section>
  );
}
