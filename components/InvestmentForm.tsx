'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


interface InvestmentFormData {
  name: string;
  email: string;
  amount: string;
}

interface InvestmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

export default function InvestmentForm({ isOpen, onClose, projectTitle }: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentFormData>({
    name: '',
    email: '',
    amount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('https://sportchain.itzimi.com/api/interested_investors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          proyecto: projectTitle
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            amount: ''
          });
          setSubmitStatus('idle');
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.message || 'Error al enviar el formulario');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        amount: ''
      });
      setSubmitStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--background)', 
          border: '1px solid rgba(220, 196, 142, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Invertir en {projectTitle}</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="transition-colors duration-200 disabled:opacity-50"
            style={{ color: 'rgba(11, 31, 59, 0.7)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(11, 31, 59, 0.7)';
            }}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{ 
              backgroundColor: 'rgba(220, 196, 142, 0.2)', 
              border: '1px solid rgba(220, 196, 142, 0.4)'
            }}
          >
            <p className="text-center font-medium" style={{ color: 'var(--color-accent-gold)' }}>
              ¡Formulario enviado exitosamente! Nos pondremos en contacto contigo pronto.
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <p className="text-center font-medium" style={{ color: '#ef4444' }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all duration-200 disabled:opacity-50 placeholder:opacity-60"
              style={{
                backgroundColor: 'var(--color-muted)',
                border: '1px solid rgba(220, 196, 142, 0.3)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 196, 142, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(220, 196, 142, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all duration-200 disabled:opacity-50 placeholder:opacity-60"
              style={{
                backgroundColor: 'var(--color-muted)',
                border: '1px solid rgba(220, 196, 142, 0.3)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 196, 142, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(220, 196, 142, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Monto dispuesto a invertir (USD) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="100"
              step="100"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all duration-200 disabled:opacity-50 placeholder:opacity-60"
              style={{
                backgroundColor: 'var(--color-muted)',
                border: '1px solid rgba(220, 196, 142, 0.3)',
                color: 'var(--foreground)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(220, 196, 142, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(220, 196, 142, 0.3)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="Ingresa el monto que deseas invertir"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold w-full px-4 py-3 font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: 'var(--color-primary)' }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: 'rgba(11, 31, 59, 0.7)' }}>
            Al enviar este formulario, aceptas que nos pongamos en contacto contigo.
          </p>
        </div>
      </div>
    </div>
  );
}
