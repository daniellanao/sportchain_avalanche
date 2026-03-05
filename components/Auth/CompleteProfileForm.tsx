'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';

type Props = {
  profileId: string;
  currentFirstName?: string;
  currentLastName?: string;
  onComplete: () => void;
};

export default function CompleteProfileForm({
  profileId,
  currentFirstName = '',
  currentLastName = '',
  onComplete,
}: Props) {
  const [firstName, setFirstName] = useState(currentFirstName);
  const [lastName, setLastName] = useState(currentLastName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last) {
      setError('Por favor completa nombre y apellido.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ first_name: first, last_name: last })
      .eq('id', profileId);
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    onComplete();
    setLoading(false);
  };

  return (
    <main className="min-h-screen py-20 flex items-center justify-center px-4" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(220, 196, 142, 0.3)' }}>
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: 'var(--foreground)' }}>
          Completa tu perfil
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: 'var(--color-subtle-text)' }}>
          Necesitamos tu nombre y apellido para continuar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                id="first_name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]"
                style={{ borderColor: 'rgba(220, 196, 142, 0.5)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-1">
              Apellido
            </label>
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                id="last_name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]"
                style={{ borderColor: 'rgba(220, 196, 142, 0.5)' }}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary)' }}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Guardando...
              </>
            ) : (
              'Continuar al Dashboard'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
