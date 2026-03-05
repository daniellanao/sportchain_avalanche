import Image from 'next/image';

export default function MisionVision() {
  return (
    <>
      {/* Misión y Visión Section */}
      <section className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--foreground)' }}>Misión y Visión</h2>            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl backdrop-blur-sm" style={{ backgroundColor: 'var(--color-muted)', border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <h3 className="text-3xl font-semibold mb-4" style={{ color: 'var(--color-accent-gold)' }}>Misión</h3>
              <p className="leading-relaxed" style={{ color: 'var(--foreground)' }}>
                Mejorar la infraestructura deportiva en Latinoamérica 
                y ofrecer a las personas una nueva forma de inversión segura y accesible, 
                permitiendo que cualquier persona pueda participar en la copropiedad de complejos deportivos.
              </p>
            </div>

            <div className="p-8 rounded-xl backdrop-blur-sm" style={{ backgroundColor: 'var(--color-muted)', border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <h3 className="text-3xl font-semibold mb-4" style={{ color: 'var(--color-accent-gold)' }}>Visión</h3>
              <p className="leading-relaxed" style={{ color: 'var(--foreground)' }}>
                Construir y operar grandes centros deportivos de clase mundial como 
                la Rafa Nadal Academy o Aspire Academy en Doha a lo largo de Latinoamérica, y convertirnos en el líder regional de la inversión deportiva.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="relative h-64 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <Image
                src="/rafa_nadal_academy.jpg"
                alt="Rafa Nadal Academy"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <Image
                src="/aspire_academy.jpg"
                alt="Aspire Academy Doha"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}