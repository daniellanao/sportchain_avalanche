'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCheckCircle, faClock, faSpinner } from '@fortawesome/free-solid-svg-icons';

// Mock data
const mockMetrics = {
  totalInvested: 12500,
  payoutsReceived: 3200,
  claimableBalance: 850,
  returnOnInvestment: Math.round(((3200 + 850) / 12500) * 100),
};

const mockInvestments = [
  {
    id: '1',
    project: 'Complejo de Padel - Buenos Aires',
    amountInvested: 5000,
    status: 'active',
    tokens: 50,
    claimable: 450,
    payoutReceived: 1200,
  },
  {
    id: '2',
    project: 'Complejo de Padel - Lima',
    amountInvested: 7500,
    status: 'active',
    tokens: 75,
    claimable: 400,
    payoutReceived: 2000,
  },
];

const mockTransactions = [
  {
    id: '1',
    date: '2025-01-15',
    project: 'Complejo de Padel - Buenos Aires',
    action: 'Investment',
    amount: 5000,
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: '2',
    date: '2025-01-10',
    project: 'Complejo de Padel - Buenos Aires',
    action: 'Payout',
    amount: 1200,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
  },
  {
    id: '3',
    date: '2025-01-05',
    project: 'Complejo de Padel - Lima',
    action: 'Investment',
    amount: 7500,
    transactionHash: '0x9876543210fedcba9876543210fedcba98765432',
  },
  {
    id: '4',
    date: '2024-12-28',
    project: 'Complejo de Padel - Lima',
    action: 'Payout',
    amount: 2000,
    transactionHash: '0xfedcba0987654321fedcba0987654321fedcba09',
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

const truncateHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

export default function Demo() {
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (investmentId: string) => {
    setClaimingId(investmentId);
    // Simulate API call
    setTimeout(() => {
      setClaimingId(null);
      alert(`Claimed successfully for investment ${investmentId}`);
    }, 1500);
  };

  return (
    <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--foreground)' }}>
          Demo del Dashboard de Inversiones
        </h1>

        {/* First Row: Metrics */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Invested */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid rgba(220, 196, 142, 0.3)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
                Total Invertido
              </p>
              <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                {formatCurrency(mockMetrics.totalInvested)}
              </p>
            </div>

            {/* Payouts Received */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid rgba(220, 196, 142, 0.3)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
                Pagos Recibidos
              </p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
                {formatCurrency(mockMetrics.payoutsReceived)}
              </p>
            </div>

            {/* Claimable Balance */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid rgba(220, 196, 142, 0.3)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
                Pagos por Cobrar
              </p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
                {formatCurrency(mockMetrics.claimableBalance)}
              </p>
            </div>

            {/* Return on Investment */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid rgba(220, 196, 142, 0.3)',
              }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--color-subtle-text)' }}>
                Capital Recuperado
              </p>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
                {mockMetrics.returnOnInvestment}%
              </p>
            </div>
          </div>
        </section>

        {/* Second Row: Investment Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Mis Inversiones
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid rgba(220, 196, 142, 0.3)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(220, 196, 142, 0.3)' }}>
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
                  {mockInvestments.map((investment, index) => (
                    <tr
                      key={investment.id}
                      style={{
                        borderBottom: index < mockInvestments.length - 1 ? '1px solid rgba(220, 196, 142, 0.2)' : 'none',
                      }}
                    >
                      <td className="py-4 px-6 font-medium" style={{ color: 'var(--foreground)' }}>
                        {investment.project}
                      </td>
                      <td className="py-4 px-6 text-right" style={{ color: 'var(--foreground)' }}>
                        {formatCurrency(investment.amountInvested)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: investment.status === 'active' 
                              ? 'rgba(227, 194, 115, 0.18)' 
                              : 'rgba(107, 114, 128, 0.18)',
                            color: investment.status === 'active' 
                              ? 'var(--color-accent-gold)' 
                              : 'var(--color-subtle-text)',
                          }}
                        >
                          {investment.status === 'active' ? (
                            <>
                              <FontAwesomeIcon icon={faCheckCircle} />
                              Activo
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faClock} />
                              Pendiente
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" style={{ color: 'var(--foreground)' }}>
                        {investment.tokens.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right" style={{ color: 'var(--color-accent-gold)' }}>
                        {formatCurrency(investment.claimable)}
                      </td>
                      <td className="py-4 px-6 text-right" style={{ color: 'var(--color-accent-gold)' }}>
                        {formatCurrency(investment.payoutReceived)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleClaim(investment.id)}
                          disabled={claimingId === investment.id || investment.claimable === 0}
                          className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {claimingId === investment.id ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                              Reclamando...
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
          </div>
        </section>

        {/* Third Row: Transaction History */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Historial de Transacciones
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid rgba(220, 196, 142, 0.3)',
            }}
          >
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
                  {mockTransactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      style={{
                        borderBottom: index < mockTransactions.length - 1 ? '1px solid rgba(220, 196, 142, 0.2)' : 'none',
                      }}
                    >
                      <td className="py-4 px-6" style={{ color: 'var(--foreground)' }}>
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-4 px-6 font-medium" style={{ color: 'var(--foreground)' }}>
                        {transaction.project}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: transaction.action === 'Investment' 
                              ? 'rgba(18, 48, 93, 0.15)' 
                              : 'rgba(227, 194, 115, 0.18)',
                            color: transaction.action === 'Investment' 
                              ? 'var(--color-primary)' 
                              : 'var(--color-accent-gold)',
                          }}
                        >
                          {transaction.action === 'Investment' ? 'Inversión' : 'Payout'}
                        </span>
                      </td>
                      <td
                        className="py-4 px-6 text-right font-semibold"
                        style={{
                          color: transaction.action === 'Investment' 
                            ? 'var(--foreground)' 
                            : 'var(--color-accent-gold)',
                        }}
                      >
                        {transaction.action === 'Investment' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm hover:underline"
                          style={{ color: 'var(--color-primary)' }}
                        >
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
    </main>
  );
}
