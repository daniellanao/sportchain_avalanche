'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle, type IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface ConfirmationModalDetail {
  label: string;
  value: string;
}

export interface ConfirmationModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Called when the user closes the modal (X, Cerrar, or backdrop) */
  onClose: () => void;
  /** Modal title (e.g. "Pago realizado") */
  title: string;
  /** Short message (e.g. "Tu inversión fue registrada correctamente.") */
  message: string;
  /** Optional list of label/value pairs shown below the message */
  details?: ConfirmationModalDetail[];
  /** Optional icon - defaults to faCheckCircle (success). Pass a different icon for other confirmation types. */
  icon?: IconDefinition;
  /** Optional label for the primary button. Default: "Cerrar" */
  closeButtonLabel?: string;
}

export default function ConfirmationModal({
  open,
  onClose,
  title,
  message,
  details = [],
  icon = faCheckCircle,
  closeButtonLabel = 'Cerrar',
}: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        className="relative rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
        style={{
          backgroundColor: 'var(--background)',
          border: '2px solid rgba(220, 196, 142, 0.4)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="confirmation-modal-title" className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded transition-colors duration-200 hover:bg-black/10"
            style={{ color: 'var(--color-subtle-text)' }}
            aria-label="Cerrar"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        {/* Message + icon */}
        <div
          className="mb-6 p-5 rounded-lg flex flex-col items-center gap-3 text-center"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
          }}
        >
          <FontAwesomeIcon
            icon={icon}
            className="flex-shrink-0"
            style={{ color: 'rgb(22, 163, 74)', fontSize: '2rem' }}
          />
          <p className="font-medium" style={{ color: 'var(--foreground)' }}>
            {message}
          </p>
        </div>

        {/* Optional details */}
        {details.length > 0 && (
          <ul className="mb-6 space-y-2">
            {details.map(({ label, value }) => (
              <li key={label} className="flex justify-between gap-4 py-2 border-b border-black/10 last:border-0">
                <span className="text-sm font-medium" style={{ color: 'var(--color-subtle-text)' }}>{label}</span>
                <span className="text-sm font-semibold text-right" style={{ color: 'var(--foreground)' }}>{value}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 font-bold rounded-lg transition-all duration-200 hover:opacity-95"
          style={{
            backgroundColor: 'var(--color-accent-gold)',
            color: 'var(--color-primary)',
          }}
        >
          {closeButtonLabel}
        </button>
      </div>
    </div>
  );
}
