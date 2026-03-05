'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'], 
})

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'INICIO', href: '/', icon: 'home' },
    { name: 'PROYECTOS', href: '/proyectos', icon: 'project' },
    { name: 'EVENTOS', href: '/eventos', icon: 'coins' },
    { name: 'DEMO DASHBOARD', href: '/demo', icon: 'demo' }
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
          <div className={`hidden md:flex space-x-8 ${montserrat.className}`} style={{ letterSpacing: '0.05em' }}>
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
