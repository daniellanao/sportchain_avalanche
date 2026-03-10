'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { isProfileComplete } from '@/lib/supabase/profiles';
import CompleteProfileForm from '@/components/Auth/CompleteProfileForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCheckCircle, faClock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ProjectsTable from '@/components/dashboard/ProjectsTable';
import InvestmentsTable from '@/components/dashboard/InvestmentsTable';
import ConfirmationModal from '@/components/ConfirmationModal';

const PAYMENT_CONFIRMATION_KEY = 'sportchain_payment_confirmation';

// Mock metrics (can be replaced later with real aggregates from transactions)
const mockMetrics = {
  totalInvested: 12500,
  payoutsReceived: 3200,
  claimableBalance: 850,
  returnOnInvestment: Math.round(((3200 + 850) / 12500) * 100),
};

const mockTransactions = [
  { id: '1', date: '2025-01-15', project: 'Complejo de Padel - Buenos Aires', action: 'Investment', amount: 5000, transactionHash: '0x1234567890abcdef1234567890abcdef12345678' },
  { id: '2', date: '2025-01-10', project: 'Complejo de Padel - Buenos Aires', action: 'Payout', amount: 1200, transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12' },
  { id: '3', date: '2025-01-05', project: 'Complejo de Padel - Lima', action: 'Investment', amount: 7500, transactionHash: '0x9876543210fedcba9876543210fedcba98765432' },
  { id: '4', date: '2024-12-28', project: 'Complejo de Padel - Lima', action: 'Payout', amount: 2000, transactionHash: '0xfedcba0987654321fedcba0987654321fedcba09' },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
const truncateHash = (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`;

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading, error: profileError, refetch } = useProfile(user?.id, user?.email ?? undefined);
  const [paymentConfirmation, setPaymentConfirmation] = useState<{ amount: number; projectTitle: string } | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || loading) return;
    try {
      const raw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(PAYMENT_CONFIRMATION_KEY) : null;
      if (raw) {
        const data = JSON.parse(raw) as { amount: number; projectTitle: string };
        sessionStorage.removeItem(PAYMENT_CONFIRMATION_KEY);
        setPaymentConfirmation(data);
      }
    } catch {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(PAYMENT_CONFIRMATION_KEY);
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" style={{ color: 'var(--color-accent-gold)' }} />
      </main>
    );
  }

  if (profileLoading || (user && !profile && !profileError)) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" style={{ color: 'var(--color-accent-gold)' }} />
      </main>
    );
  }

  if (profileError) {
    return (
      <main className="min-h-screen py-20 flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <Navbar />
        <p className="text-red-500 mb-4">Error al cargar el perfil: {profileError}</p>
      </main>
    );
  }

  if (profile && !isProfileComplete(profile)) {
    return (
      <>
        <Navbar />
        <CompleteProfileForm
          profileId={profile.id}
          currentFirstName={profile.first_name}
          currentLastName={profile.last_name}
          onComplete={refetch}
        />
      </>
    );
  }

  const displayName = profile?.first_name?.trim()
    ? `${profile.first_name}${profile.last_name?.trim() ? ` ${profile.last_name}` : ''}`
    : user.email;

  return (
    <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: 'var(--foreground)' }}>
          Mi Dashboard
        </h1>
        <p className="text-center mb-8" style={{ color: 'var(--color-subtle-text)' }}>
          Bienvenido, {displayName}
        </p>

        {/* Metrics */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>Total Invertido</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{formatCurrency(mockMetrics.totalInvested)}</p>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>Pagos Recibidos</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>{formatCurrency(mockMetrics.payoutsReceived)}</p>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>Pagos por Cobrar</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>{formatCurrency(mockMetrics.claimableBalance)}</p>
            </div>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>Capital Recuperado</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>{mockMetrics.returnOnInvestment}%</p>
            </div>
          </div>
        </section>

        {/* Investments — from profile_investments */}
        <InvestmentsTable profileId={user?.id ?? null} refetchTrigger={paymentConfirmation} />

        {/* All projects — invest CTA */}
        <ProjectsTable />

        {/* Transaction History */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Historial de Transacciones</h2>
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(220, 196, 142, 0.3)' }}>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Fecha</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Proyecto</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Acción</th>
                    <th className="text-right py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Monto</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: 'var(--color-subtle-text)' }}>Hash de Transacción</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((transaction, index) => (
                    <tr key={transaction.id} style={{ borderBottom: index < mockTransactions.length - 1 ? '1px solid rgba(220, 196, 142, 0.2)' : 'none' }}>
                      <td className="py-4 px-6" style={{ color: 'var(--foreground)' }}>{formatDate(transaction.date)}</td>
                      <td className="py-4 px-6 font-medium" style={{ color: 'var(--foreground)' }}>{transaction.project}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: transaction.action === 'Investment' ? 'rgba(18, 48, 93, 0.15)' : 'rgba(227, 194, 115, 0.18)', color: transaction.action === 'Investment' ? 'var(--color-primary)' : 'var(--color-accent-gold)' }}>
                          {transaction.action === 'Investment' ? 'Inversión' : 'Payout'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold" style={{ color: transaction.action === 'Investment' ? 'var(--foreground)' : 'var(--color-accent-gold)' }}>
                        {transaction.action === 'Investment' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-4 px-6">
                        <a href={`https://etherscan.io/tx/${transaction.transactionHash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
                          <span style={{ fontFamily: 'monospace' }}>{truncateHash(transaction.transactionHash)}</span>
                          <FontAwesomeIcon icon={faLink} className="text-xs" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <ConfirmationModal
        open={paymentConfirmation !== null}
        onClose={() => setPaymentConfirmation(null)}
        title="Pago realizado"
        message="Tu inversión fue registrada correctamente."
        details={
          paymentConfirmation
            ? [
                { label: 'Monto', value: formatCurrency(paymentConfirmation.amount) },
                { label: 'Proyecto', value: paymentConfirmation.projectTitle },
              ]
            : []
        }
      />
    </main>
  );
}
