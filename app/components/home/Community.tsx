import Image from 'next/image';
import Link from 'next/link';

export default function Community() {
  return (
    <>     
       {/* Community & Events Section */}
      <section className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Comunidad en acción</h2>
              <p className="text-lg mb-6" style={{ color: 'var(--foreground)' }}>Los eventos y torneos son el corazón de SportChain. No se trata solo de invertir, sino de vivir el deporte, competir, celebrar y construir identidad juntos.</p>
              <p className="mb-8" style={{ color: 'var(--foreground)' }}>Cada encuentro fortalece la red: más jugadores, más ideas, más valor compartido. Así es como el deporte se transforma en una experiencia de comunidad y futuro.</p>
              <Link 
                href="/eventos" 
                className="btn-gold inline-block px-8 py-4 text-white font-bold rounded-lg text-lg"
              >
                Ver próximos eventos
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-44 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(220, 196, 142, 0.2)' }}>
                <Image src="/eventos/sportchain_padel_tournament.jpg" alt="Entrenamiento y espíritu deportivo" fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
              <div className="relative h-60 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(220, 196, 142, 0.2)' }}>
                <Image src="/eventos/sportchain_padel_tournament_5.jpg" alt="Eventos y torneos comunitarios" fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
              <div className="relative h-60 rounded-xl overflow-hidden col-span-2" style={{ border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <Image src="/eventos/sportchain_padel_tournament_6.jpg" alt="Eventos y torneos comunitarios" fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}