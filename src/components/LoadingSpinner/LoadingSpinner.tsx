import React from 'react';
import { LoadingSpinnerProps } from '@/types';
import './LoadingSpinner.css';

/**
 * Componente de spinner de carga
 * Muestra un indicador visual cuando la aplicación está procesando
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  show = true,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className={`loading-spinner loading-spinner--${size}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-spinner__circle"></div>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
