'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner, faKey } from '@fortawesome/free-solid-svg-icons';

type Step = 'email' | 'code';
type Status = 'idle' | 'loading' | 'error';

export default function MagicOtpLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // No emailRedirectTo = 6-digit OTP flow; user verifies on this page
      },
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setStep('code');
    setStatus('idle');
    setMessage('');
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = code.trim().replace(/\s/g, '');
    if (!email.trim() || token.length < 6) {
      setStatus('error');
      setMessage('Ingresa el código que recibiste por correo.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: 'email',
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    router.push('/');
    router.refresh();
  };

  const backToEmail = () => {
    setStep('email');
    setCode('');
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="w-full max-w-sm p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
      <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
        Iniciar sesión con código
      </h2>

      {step === 'email' ? (
        <>
          <p className="text-sm opacity-80 mb-4">
            Ingresa tu correo y te enviaremos un código para iniciar sesión.
          </p>
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="otp-email" className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                />
                <input
                  id="otp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={status === 'loading'}
                  className="w-full pl-10 pr-4 py-2 rounded border bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]"
                  style={{ borderColor: 'rgba(220, 196, 142, 0.5)' }}
                />
              </div>
            </div>

            {status === 'error' && message && (
              <p className="text-sm text-red-500">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2 px-4 rounded font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary)' }}
            >
              {status === 'loading' ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Enviando código...
                </>
              ) : (
                'Enviar código'
              )}
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-sm opacity-80 mb-4">
            Revisa tu correo en <strong>{email}</strong> e ingresa el código que recibiste.
          </p>
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="otp-code" className="block text-sm font-medium mb-1">
                Código
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faKey}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                />
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="00000000"
                  maxLength={8}
                  disabled={status === 'loading'}
                  className="w-full pl-10 pr-4 py-2 rounded border bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)] text-center text-lg tracking-[0.5em] font-mono"
                  style={{ borderColor: 'rgba(220, 196, 142, 0.5)' }}
                />
              </div>
            </div>

            {status === 'error' && message && (
              <p className="text-sm text-red-500">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || code.replace(/\s/g, '').length < 6}
              className="w-full py-2 px-4 rounded font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary)' }}
            >
              {status === 'loading' ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar código'
              )}
            </button>

            <button
              type="button"
              onClick={backToEmail}
              disabled={status === 'loading'}
              className="w-full py-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              Usar otro correo
            </button>
          </form>
        </>
      )}
    </div>
  );
}
