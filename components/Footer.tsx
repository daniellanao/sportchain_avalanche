'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faInstagram, faWhatsapp, faXTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Inicio', href: '/' },
      { name: 'Proyectos', href: '/proyectos' },
      { name: 'Eventos', href: '/eventos' }
    ],   
    social: [
      { name: 'LinkedIn', href: 'https://linkedin.com/company/sportchain-io', icon: 'linkedin' },
      { name: 'X', href: 'https://x.com/sportchain_io', icon: 'X' },
      { name: 'Instagram', href: 'https://instagram.com/sportchain.io', icon: 'instagram' },
      { name: 'WhatsApp', href: 'https://wa.me/5491172369694', icon: 'whatsapp' }
    ]
  };

  const renderSocialIcon = (icon: string) => {
    switch (icon) {
      case 'linkedin':
        return (
          <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />          
        );
      case 'X':
        return (
          <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
        );
      case 'instagram':
        return (
          <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
        );
      case 'whatsapp':
          return (
            <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
          );
      default:
        return null;
    }
  };

  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(220, 196, 142, 0.3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/sportchain_isotipo.png"
                  alt="SportChain Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-white text-xl logo">SportChain</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Plataforma para invertir y recibir ganancias mediante instalaciones deportivas.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  aria-label={social.name}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  {renderSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 navbar-text">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-accent-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 navbar-text">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: 'var(--color-accent-gold)' }}/>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>info@sportchain.io</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faWhatsapp} style={{ color: 'var(--color-accent-gold)' }}/>
                  <a
                    href="https://wa.me/5491172369694"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-accent-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    }}
                  >
                    +54 9 11 7236-9694
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(220, 196, 142, 0.3)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              © {currentYear} SportChain. Todos los derechos reservados.
            </div>           
          </div>
        </div>
      </div>
    </footer>
  );
}
