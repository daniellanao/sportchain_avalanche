'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { Montserrat } from "next/font/google";
import { useAuth } from '@/context/AuthContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'], 
})

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  const navItems = [
    { name: 'INICIO', href: '/', icon: 'home' },
    { name: 'PROYECTOS', href: '/proyectos', icon: 'project' },
    { name: 'EVENTOS', href: '/eventos', icon: 'coins' },    
    ...(user ? [{ name: 'DASHBOARD', href: '/dashboard', icon: 'dashboard' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <Image
                  src="/sportchain_isotipo.png"
                  alt="SportChain Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <span className={`text-white text-xl ${montserrat.className}`} style={{ letterSpacing: '0.05em' }}>SPORTCHAIN</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-8 ${montserrat.className}`} style={{ letterSpacing: '0.05em' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-medium pb-1 transition-colors duration-200 ${
                    isActive 
                      ? 'text-[var(--color-accent-gold)] border-b-2 border-[var(--color-accent-gold)]' 
                      : 'text-white hover:text-[var(--color-accent-gold)] border-b-2 border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            {!loading && (
              user ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: 'var(--color-accent-gold)',
                      color: 'var(--color-primary)',
                      borderColor: 'var(--color-accent-gold)',
                      boxShadow: '0 2px 8px rgba(220, 196, 142, 0.35)',
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="shrink-0" />
                    <span className="text-sm max-w-[140px] truncate">{user.email}</span>
                  </button>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 py-2 w-48 rounded-lg shadow-xl z-50 bg-white border border-gray-100" style={{ color: 'var(--color-primary)' }}>
                        <button
                          onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 rounded mx-1 transition-colors"
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} />
                          Cerrar sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 border-2 border-[var(--color-accent-gold)] bg-transparent text-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)] hover:text-[var(--color-primary)] hover:shadow-[0_2px_8px_rgba(220,196,142,0.35)] scale-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  INICIAR SESIÓN
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[var(--color-accent-gold)] focus:outline-none transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
            <div className="px-2 pt-2 pb-3 space-y-1 border-t" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 ${montserrat.className} transition-colors duration-200 ${
                      isActive 
                        ? 'text-[var(--color-accent-gold)] border-l-2 border-[var(--color-accent-gold)] pl-[11px]' 
                        : 'text-white hover:text-[var(--color-accent-gold)] border-l-2 border-transparent'
                    }`}
                    style={{ letterSpacing: '0.05em' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {!loading && (
                user ? (
                  <div className="px-3 py-3 mt-2 mx-2 rounded-lg border-2" style={{ borderColor: 'var(--color-accent-gold)', backgroundColor: 'rgba(220, 196, 142, 0.15)' }}>
                    <p className="text-white text-sm truncate mb-2 font-medium">{user.email}</p>
                    <button
                      onClick={() => { signOut(); setIsMenuOpen(false); }}
                      className="flex items-center gap-2 text-[var(--color-accent-gold)] hover:opacity-90 text-sm font-medium"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="mx-2 mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium border-2 transition-colors"
                    style={{ borderColor: 'var(--color-accent-gold)', color: 'var(--color-accent-gold)' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    INICIAR SESIÓN
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
