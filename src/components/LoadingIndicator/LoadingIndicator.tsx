import React from 'react';
import { useAppContext } from '@/context/AppContext';
import './LoadingIndicator.css';

/**
 * Indicador de carga fijo en la esquina superior derecha
 */
const LoadingIndicator: React.FC = () => {
  const { state } = useAppContext();

  if (!state.loading) {
    return null;
  }

  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <div className="loading-indicator__spinner">
        <div className="loading-indicator__circle"></div>
      </div>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default LoadingIndicator;
