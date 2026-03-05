'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import InvestmentForm from '../../components/InvestmentForm';

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function PadelBuenosAires() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [project, setProject] = useState({
    title: 'Complejo de Padel',
    location: 'Buenos Aires, Argentina',
    expectedYieldPercent: 20,
    image: '/proyectos/mvp_padel_court.png',
    status: 'abierto',
    targetGoalUsd: 200000,
    committedUsd: 0,
    progressPercent: 0,
    description: 'Complejo de pádel con 3 canchas profesionales, ubicado en zona estratégica de Buenos Aires.',
    sportType: 'Pádel',
    roiYears: 3,
    revenuePercentPerYear: 20,
    revenuePeriodYears: 3,
    features: [
      '3 canchas profesionales de pádel',
      'Ubicación estratégica en Buenos Aires',
      'Instalaciones de primera calidad',
      'Gestión profesional y operación continua',
      'Acceso a eventos y torneos exclusivos',
    ],
    investmentDetails: {
      minimumInvestment: 100,      
      investmentUnit: 100,
    },
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch('https://sportchain.itzimi.com/api/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const { capital, percentage } = result.data;
            
            setProject(prevProject => ({
              ...prevProject,
              committedUsd: capital || prevProject.committedUsd,
              progressPercent: percentage || prevProject.progressPercent
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        // Keep default values if API fails
      }
    };

    fetchProjectData();
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Project Info */}
            <div className="md:col-span-8">
              {/* Etiquetas superiores */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-accent-gold)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {project.status.toUpperCase()}
                </span>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {project.sportType.toUpperCase()}
                </span>
              </div>

              {/* Título y ubicación */}
              <h1
                className="text-4xl md:text-5xl font-bold mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                {project.title}
              </h1>
              <p
                className="text-sm md:text-base mb-4"
                style={{ color: 'var(--color-subtle-text)' }}
              >
                {project.location}
              </p>

              {/* Snapshot de proyecto */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-[11px] mb-1" style={{ color: 'var(--color-subtle-text)' }}>
                    Estado
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {project.status === 'abierto' ? 'Abierto a inversores' : 'Próximamente'}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-[11px] mb-1" style={{ color: 'var(--color-subtle-text)' }}>
                    Ticket mínimo
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    Desde {formatCurrency(100)}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-[11px] mb-1" style={{ color: 'var(--color-subtle-text)' }}>
                    Horizonte estimado
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    3 años                  
                  </p>
                </div>
              </div>

              {/* Descripción breve */}
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: 'var(--foreground)' }}
              >
                {project.description}
              </p>

              {/* Métricas clave */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-muted)',
                    border: '1px solid rgba(220, 196, 142, 0.3)',
                  }}
                >
                  <p
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-subtle-text)' }}
                  >
                    Rendimiento esperado
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-accent-gold)' }}
                  >
                    {project.expectedYieldPercent}% Anual
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-muted)',
                    border: '1px solid rgba(220, 196, 142, 0.3)',
                  }}
                >
                  <p
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-subtle-text)' }}
                  >
                    Período estimado del proyecto
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-accent-gold)' }}
                  >
                    {project.roiYears} años
                  </p>
                </div>
                {/* Progreso de financiación */}
              <div>
                <div
                  className="flex justify-between text-sm mb-2"
                  style={{ color: 'var(--color-subtle-text)' }}
                >
                  <span>
                    $
                    {Number(project.committedUsd).toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{' '}
                    comprometido
                  </span>
                  <span>Meta {formatCurrency(project.targetGoalUsd)}</span>
                </div>
                <div
                  className="w-full h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'rgba(220, 196, 142, 0.2)' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(Math.max(project.progressPercent, 0), 100)}%`,
                      backgroundColor: 'var(--color-accent-gold)',
                    }}
                  />
                </div>
                <div
                  className="text-right text-sm mt-2"
                  style={{ color: 'var(--color-subtle-text)' }}
                >
                  {project.progressPercent}% completado
                </div>
              </div>

              </div>

              

              {/* CTA principal */}
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-gold inline-block px-8 py-4 rounded-lg text-lg font-bold cursor-pointer"
                style={{ color: 'var(--color-primary)' }}
              >
                Invertir
              </button>
            </div>

            {/* Image */}
            <div className="relative h-96 lg:h-[500px] md:col-span-4 rounded-xl overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

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
              Buenos Aires, Argentina
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
              USD 200,000
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Aporte mínimo
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Desde USD 100
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Rendimiento anual estimado
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-accent-gold)' }}>
              18% – 20%
            </p>
          </div>

          {/* Item */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'rgba(11, 31, 59, 0.6)' }}>
              Horizonte de inversión
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              3 – 5 años
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
            Invertir Ahora
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

