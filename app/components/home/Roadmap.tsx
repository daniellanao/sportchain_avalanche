import Image from 'next/image';

export default function Roadmap() {
  return (
    <>     
       {/* Roadmap Section */}
       <section className="relative py-20" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Roadmap</h2>
            <p className="mt-4 max-w-3xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Un camino simple en 4 pasos para construir el futuro del deporte juntos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 text-white golden-circle">1</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Reunir a la comunidad</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Conectar a inversores y deportistas que comparten la misma visión.</p>
            </div>
            <div className="p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 text-white golden-circle">2</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Recaudar Fondos</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Objetivo: USD 200,000 para el primer complejo de padel.</p>
            </div>
            <div className="p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 text-white golden-circle">3</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Construir y operar</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Construir y operar el complejo de padel. Buscando buenos resultados.</p>
            </div>
            <div className="p-6 rounded-xl backdrop-blur-sm flex flex-col items-center text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(220, 196, 142, 0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 text-white golden-circle">4</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Escalar a más ciudades</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Replicar el modelo y expandir por toda Latinoamérica.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}