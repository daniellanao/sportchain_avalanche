'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import InvestmentForm from '@/components/InvestmentForm';
import ProjectHero, { type ProjectHeroData } from '@/components/projects/ProjectHero';
import { createClient } from '@/lib/supabase/client';

const SLUG = 'padel_buenos_aires';
const DEFAULT_IMAGE = '/proyectos/mvp_padel_court.png';

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function PadelBuenosAires() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [project, setProject] = useState<ProjectHeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setError(null);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', SLUG)
          .eq('active', true)
          .maybeSingle();

        if (fetchError) {
          setError(fetchError.message);
          setProject(null);
          return;
        }
        if (!data) {
          setError('Proyecto no encontrado');
          setProject(null);
          return;
        }
        setProject({
          title: data.title,
          location: data.location ?? '',
          description: data.description ?? '',
          image: data.image_url ?? DEFAULT_IMAGE,
          status: (data.status ?? 'abierto').toLowerCase(),
          targetGoalUsd: Number(data.amount_target_usd) || 0,
          committedUsd: Number(data.amount_committed_usd) || 0,
          progressPercent: Number(data.progress_committed_percent) ?? 0,
          expectedYieldPercent: Number(data.yield_expected_percent) || 0,
          projectLifeYears: data.project_life_years ?? null,
          minimumInvestmentUsd: Number(data.minimum_investment_usd) || 100,
          sportType: data.sport ?? 'Pádel',
        });
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el proyecto');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-300/20" />
            <div className="h-12 w-3/4 rounded bg-gray-300/20" />
            <div className="h-6 w-1/2 rounded bg-gray-300/20" />
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-gray-300/20" />
              ))}
            </div>
            <div className="h-24 rounded bg-gray-300/20 mt-6" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-lg" style={{ color: 'var(--color-subtle-text)' }}>
            {error ?? 'Proyecto no encontrado'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />

      <ProjectHero project={project} onInvestClick={() => setIsFormOpen(true)} />

<section className="py-16" style={{ backgroundColor: 'var(--color-muted)' }}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

      {/* Resumen Ejecutivo en el grid */}
      <div className="bg-[var(--color-muted)] rounded-xl p-6 h-fit flex flex-col">
        <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          Resumen Ejecutivo
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-justify" style={{ color: 'var(--foreground)' }}>
          <p>
            El complejo de Pádel es el primer proyecto de SportChain diseñado para aumentar la infraestructura deportiva de Latinoamérica 
            y permitir que cualquier persona pueda participar en su desarrollo con una inversión accesible y pueda obtener ganancias. 
          </p>
          <p>
            La demanda de pádel a nivel mundial en la ciudad crece a un ritmo acelerado, pero la oferta de canchas no acompaña. 
            Este desbalance crea una oportunidad real para construir espacios deportivos sostenibles que generen ingresos 
            constantes desde el primer día.
          </p>
          <p>
            El objetivo es desarrollar un nuevo complejo de pádel ubicado en Buenos Aires, diseñado para operar con alta ocupación, 
            ofrecer servicios adicionales como clases y torneos, y convertirse en un punto de encuentro para la comunidad deportiva.
          </p>
          <p>
            Lo más importante es que este modelo permite que cualquier persona, no solo grandes inversores, puedan participar 
            en el crecimiento de la infraestructura deportiva de LATAM con un aporte inicial mucho menor al que exige el sector 
            inmobiliario o deportivo tradicional.
          </p>
          <p>
            Este proyecto es el primer paso de una visión mayor: construir, junto con la comunidad, una red de espacios 
            deportivos modernos, rentables y accesibles en toda la región.
          </p>
        </div>
      </div>

      {/* Información Clave del Proyecto en el grid */}
      <div>
        <h2 className="text-3xl font-bold mb-10" style={{ color: 'var(--foreground)' }}>
          Información Clave del Proyecto
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Item */}
          <div className="p-5 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Tipo de proyecto
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              Complejo deportivo <br/> <span className="text-sm">3 canchas de pádel</span>
            </p>
          </div>

          <div className="p-5 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Ubicación
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              {project.location || 'Buenos Aires, Argentina'}
            </p>
          </div>

          <div className="p-5 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Estado actual
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              Diseño y licencias
            </p>
          </div>

          <div className="p-5 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Apertura estimada
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              Q2 2026
            </p>
          </div>

          <div className="p-5 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Capacidad operativa
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              250–350 reservas mensuales
            </p>
          </div>

          <div className="p-5 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Operador
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              SportChain
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</section>

<section className="py-16" style={{ backgroundColor: 'var(--color-muted)' }}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Resumen (Izquierda) */}
      <div className="bg-[var(--color-muted)] rounded-xl p-6 h-fit flex flex-col">
        <h2 className="text-3xl font-bold mb-10" style={{ color: 'var(--foreground)' }}>
          Resumen Financiero para Inversores
        </h2>

        <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--foreground)' }}>
          <p>
            El proyecto tiene un costo total estimado de <strong>USD 200,000</strong>, destinado a la construcción de tres canchas 
            de pádel con: techo, iluminación, piso, paredes, baños, vestidores, etc.             
          </p>
          <p>
            El retorno proviene de la operación diaria del complejo: reservas por hora, clases, torneos, alquiler de 
            equipamiento y otros servicios complementarios. Con la demanda actual en Palermo, Buenos Aires, se proyecta una ocupación 
            estable que permite estimar retornos competitivos dentro del sector deportivo.
          </p>
          <p>
            El horizonte de inversión sugerido es de <strong>3 a 5 años</strong>, dependiendo del ritmo de operación y crecimiento 
            del complejo. Durante ese período, se estima un rendimiento anual proyectado de 
            <strong> 18% a 20%</strong>, basado en escenarios conservadores.
          </p>
          <p>
            Este modelo permite que cualquier persona participe en el desarrollo de infraestructura deportiva real, con 
            un aporte mucho menor al que usualmente requiere un proyecto de este tipo.
          </p>
        </div>
      </div>

      {/* Información (Derecha) */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Costo total del proyecto
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {formatCurrency(project.targetGoalUsd)}
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Aporte mínimo
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Desde {formatCurrency(project.minimumInvestmentUsd)}
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Rendimiento anual estimado
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-accent-gold)' }}>
              {project.expectedYieldPercent}%
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Horizonte de inversión
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {project.projectLifeYears ?? 3} – 5 años
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Principales fuentes de ingresos
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Reservas, alquiler y sponsors.
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Demanda validada
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              +8 torneos organizados en 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            ¿Listo para invertir?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--color-subtle-text)' }}>
            Únete a otros inversores y forma parte del futuro del deporte en Latinoamérica.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-gold inline-block px-8 py-4 rounded-lg text-lg font-bold cursor-pointer"
            style={{ color: 'var(--color-primary)' }}
          >
            Estoy interesado en invertir
          </button>
        </div>
      </section>

      {/* Investment Form Modal */}
      <InvestmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        projectTitle={project.title}
      />
    </main>
  );
}

