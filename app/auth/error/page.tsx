import Link from 'next/link';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Error de autenticación</h1>
        <p className="opacity-80">{message ?? 'No se pudo completar el inicio de sesión.'}</p>
        <Link
          href="/"
          className="inline-block py-2 px-4 rounded font-medium"
          style={{ backgroundColor: 'var(--color-accent-gold)', color: 'var(--color-primary)' }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
