'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface CommitmentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MESSAGE = '¡Formulario enviado exitosamente! Nos pondremos en contacto contigo pronto. El progreso del proyecto se ha actualizado.';

export default function CommitmentSuccessModal({ isOpen, onClose }: CommitmentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--background)',
          border: '1px solid rgba(220, 196, 142, 0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Solicitud enviada
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="transition-colors duration-200"
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

        {/* Success Message - green */}
        <div
          className="mb-6 p-5 rounded-lg flex flex-col items-center gap-3 text-center"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
          }}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="flex-shrink-0"
            style={{ color: 'rgb(22, 163, 74)', fontSize: '2rem' }}
          />
          <p className="font-medium" style={{ color: 'rgb(22, 163, 74)' }}>
            {MESSAGE}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-gold w-full px-4 py-3 font-bold rounded-lg transition-all duration-200"
          style={{ color: 'var(--color-primary)' }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
