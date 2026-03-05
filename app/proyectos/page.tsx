'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Project = {
  id: string;
  title: string;
  location: string;
  expectedYieldPercent: number;
  image: string;
  status: 'abierto' | 'proximamente' | 'completado';
  targetGoalUsd: number;
  committedUsd: number;
  progressPercent: number;  
  sportType: string;
};

const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'Complejo de Padel',
    location: 'Buenos Aires, Argentina',
    expectedYieldPercent: 20,
    image: '/proyectos/mvp_padel_court.png',
    status: 'abierto',
    targetGoalUsd: 200000,
    committedUsd: 0,
    progressPercent: 20,    
    sportType: 'Pádel'
  },
  {
    id: 'p2',
    title: 'Complejo de Padel',
    location: 'Lima, Perú',
    expectedYieldPercent: 23,
    image: '/proyectos/mvp_padel_court.png',
    status: 'proximamente',
    targetGoalUsd: 250000,
    committedUsd: 125000,
    progressPercent: 50,    
    sportType: 'Padel'
  },
  {
    id: 'p3',
    title: 'Complejo Multideportivo',
    location: 'Buenos Aires, Argentina',
    expectedYieldPercent: 15,
    image: '/proyectos/proyecto_3.png',
    status: 'proximamente',
    targetGoalUsd: 500000,
    committedUsd: 0,
    progressPercent: 0,    
    sportType: 'Multideportivo',
  }
];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

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
            
            // Update the first project (p1) with API data
            setProjects(prevProjects => 
              prevProjects.map(project => 
                project.id === 'p1'
                  ? {
                      ...project,
                      committedUsd: capital || project.committedUsd,
                      progressPercent: percentage || project.progressPercent
                    }
                  : project
              )
            );
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
    <main className="min-h-screen py-20" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <h1 className="text-4xl font-bold mb-4 text-center text-blue">Proyectos de inversión</h1>
      {/* Listado de proyectos */}
      <section className="pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl p-4 backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  border: '1px solid rgba(220, 196, 142, 0.35)'
                }}
              >
                <div className="relative mb-4">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={400}
                    height={300}
                    className="rounded-xl object-cover w-full h-48"
                  />
                  <div className="absolute top-3 right-3">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      {p.sportType.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: p.status === 'abierto' 
                          ? 'var(--color-accent-gold)' 
                          : p.status === 'proximamente'
                          ? 'rgba(220, 196, 142, 0.8)'
                          : 'rgba(107, 114, 128, 0.8)',
                        color: p.status === 'abierto' ? 'var(--color-primary)' : 'white'
                      }}
                    >
                      {p.status === 'abierto' ? 'ABIERTO' : p.status === 'proximamente' ? 'PRÓXIMAMENTE' : 'COMPLETADO'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'rgba(247, 211, 122, 0.18)',
                      color: 'var(--foreground)',
                      minHeight: '28px'
                    }}
                  >
                    <FontAwesomeIcon icon={faMapMarker} className="text-blue" />
                    <span>{p.location}</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {p.title}
                </h3>


                
                {/* Progress Bar o mensaje de próximamente */}
                <div className="mb-4" style={{ minHeight: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {p.status === 'abierto' ? (
                    <>
                      <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--color-subtle-text)' }}>
                        <span>$ 
                          {Number(p.committedUsd).toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })} comprometido
                        </span>
                        <span>Meta {formatCurrency(p.targetGoalUsd)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(247, 211, 122, 0.22)' }}>
                        <div
                          className="h-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(Math.max(p.progressPercent, 0), 100)}%`,
                            backgroundColor: 'var(--color-accent-gold)'
                          }}
                        />
                      </div>
                      <div className="text-right text-xs mt-1" style={{ color: 'var(--color-subtle-text)' }}>{p.progressPercent}%</div>
                    </>
                  ) : (
                    <div
                      className="flex items-center justify-center w-full h-full text-center text-sm font-semibold"
                      style={{ color: 'var(--color-accent-gold)', minHeight: '48px' }}
                    >
                      Próximamente
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center justify-between pt-4 mt-auto"
                  style={{
                    borderTop: '1px solid rgba(220, 196, 142, 0.3)',
                  }}
                >
                  {/* Rendimiento esperado */}
                  <div>
                    <p className="text-sm mb-1" style={{ color: 'var(--color-subtle-text)' }}>
                      Rendimiento esperado
                    </p>
                    <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-gold)' }}>
                      {p.expectedYieldPercent}%
                    </p>
                  </div>
                  {/* Botón o texto Invertir/Próximamente/Completado */}
                  {p.status === 'abierto' ? (
                    <Link
                      href={
                        p.id === 'p1'
                          ? '/proyectos/padel_buenos_aires'
                          : '#'
                      }
                      className="px-6 py-3 rounded-lg text-sm font-bold text-center transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--color-accent-gold)',
                        color: 'var(--color-primary)',
                        pointerEvents: p.id === 'p1' ? 'auto' : 'none',
                        opacity: p.id === 'p1' ? 1 : 0.7,
                      }}
                    >
                      Más Info
                    </Link>
                  ) : (
                    <div
                      className="px-6 py-3 rounded-lg text-sm font-bold text-center"
                      style={{
                        backgroundColor:
                          p.status === 'proximamente'
                            ? 'rgba(247, 211, 122, 0.18)'
                            : 'rgba(31, 41, 55, 0.65)',
                        color:
                          p.status === 'proximamente'
                            ? 'var(--color-accent-gold)'
                            : 'var(--color-subtle-text)',
                        cursor: 'not-allowed',
                        minWidth: 120,
                      }}
                    >
                      {p.status === 'proximamente'
                        ? 'Próximamente'
                        : 'Completado'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
