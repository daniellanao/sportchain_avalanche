'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/sportchain_san_martin.png')" }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(6, 11, 19, 0.6)' }}></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            SPORTCHAIN
        </h1>                    
        <h3 className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--color-accent-gold)' }}>
            Plataforma para invertir y recibir ganancias mediante instalaciones deportivas.
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/proyectos" 
              className="btn-gold px-8 py-4 text-white font-bold rounded-lg text-lg text-center"
            >
            Ver Proyectos
            </Link>         
            
        </div>
        </div>
      </section>
    </>
  );
}
