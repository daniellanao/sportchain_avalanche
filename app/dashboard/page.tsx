'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { isProfileComplete } from '@/lib/supabase/profiles';
import CompleteProfileForm from '@/components/Auth/CompleteProfileForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ProjectsTable from '@/components/dashboard/ProjectsTable';
import InvestmentsTable from '@/components/dashboard/InvestmentsTable';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import MetricsBoxes from '@/components/dashboard/MetricsBoxes';
import ConfirmationModal from '@/components/ConfirmationModal';

const PAYMENT_CONFIRMATION_KEY = 'sportchain_payment_confirmation';

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading, error: profileError, refetch } = useProfile(user?.id, user?.email ?? undefined);
  const [paymentConfirmation, setPaymentConfirmation] = useState<{ amount: number; projectTitle: string } | null>(null);
  const [payoutClaimedTrigger, setPayoutClaimedTrigger] = useState(0);

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

        {/* Metrics — from profile_investments (refetch after new payment or after payout claimed) */}
        <MetricsBoxes profileId={user?.id ?? null} refetchTrigger={{ payment: paymentConfirmation, payout: payoutClaimedTrigger }} />

        {/* Investments — from profile_investments */}
        <InvestmentsTable
          profileId={user?.id ?? null}
          refetchTrigger={paymentConfirmation}
          onPayoutClaimed={() => setPayoutClaimedTrigger((t) => t + 1)}
        />

        {/* All projects — invest CTA */}
        <ProjectsTable />

        {/* Transaction History — from DB */}
        <TransactionsTable profileId={user?.id ?? null} refetchTrigger={payoutClaimedTrigger} />
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
