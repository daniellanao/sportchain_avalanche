import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import MagicOtpLogin from '@/components/Auth/MagicOtpLogin';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Inicia sesión en SportChain con Magic OTP.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 flex justify-center items-start" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <MagicOtpLogin />
    </main>
  );
}
